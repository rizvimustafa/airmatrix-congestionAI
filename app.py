import numpy as np
import cv2
import json
import io
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
from ultralytics import YOLO
from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import supervision as sv
import traceback
import logging
from config import (
    CONFIDENCE_THRESHOLD,
    IOU_THRESHOLD,
    DIAGONAL_PERCENTAGE,
    DURATION_THRESHOLD,
    MIN_CARS_IN_CLUSTER,
    CLUSTER_PROXIMITY_MULTIPLIER,
    CONGESTION_RESPITE_TIME,
    SOURCE_WEIGHTS_PATH
)

# Set up logging
logging.basicConfig(filename='app.log', level=logging.ERROR)

# Define the DetectionUtils class
class DetectionUtils:
    """Utility class for detection-related functions."""

    @staticmethod
    def get_average_car_size(detections):
        """Calculates the average size of detected cars."""
        num_detections = len(detections.xyxy)
        if num_detections == 0:
            return 0

        sample_size = min(5, num_detections)
        selected_indices = np.random.choice(num_detections, size=sample_size, replace=False)
        selected_detections = detections.xyxy[selected_indices]

        sizes = []
        for det in selected_detections:
            x_center = (det[2] + det[0]) / 2
            y_center = (det[3] + det[1]) / 2
            diagonal_dist = np.sqrt((det[2] - x_center)**2 + (det[3] - y_center)**2)
            sizes.append(diagonal_dist * 2)

        return np.mean(sizes)

    @staticmethod
    def identify_clusters(detections, average_car_size, proximity_multiplier):
        centers = [((det[2] + det[0]) / 2, (det[3] + det[1]) / 2) for det in detections.xyxy]
        tracker_ids = detections.tracker_id
        used_tracker_ids = set()  # To keep track of detections already in a cluster
        clusters = []

        for i, center in enumerate(centers):
            if tracker_ids[i] in used_tracker_ids:
                continue  # Skip if already in a cluster

            # New cluster with the current detection
            cluster = {tracker_ids[i]}
            used_tracker_ids.add(tracker_ids[i])

            # Check proximity with other detections
            for j, other_center in enumerate(centers):
                if tracker_ids[j] not in used_tracker_ids and np.linalg.norm(np.array(center) - np.array(other_center)) < proximity_multiplier * average_car_size:
                    cluster.add(tracker_ids[j])
                    used_tracker_ids.add(tracker_ids[j])

            clusters.append(cluster)

        # Convert clusters to a list of lists and print
        clusters_list = [list(cluster) for cluster in clusters]
        # print("All Clusters:", clusters_list)
        return clusters_list

video_processors = {}

def get_video_processor(video_id, res_width, res_height):
    if video_id not in video_processors:
        video_processors[video_id] = VideoProcessor(video_id, res_width, res_height)
        print(f"New VideoProcessor added for video_id {video_id}. Current video processors: {video_processors}")
    return video_processors[video_id]


# Define the VideoProcessor class
class VideoProcessor:
    """Class for processing video data."""

    CLASS_ID_TO_CLASS_NAME = ['bicycle', 'bus', 'car', 'motcycle', 'ped', 'truck', 'van']
    COLORS = sv.ColorPalette.default()

    def __init__(self, video_id: str, res_width: int, res_height: int, confidence_threshold: float = 0.5,
                 iou_threshold: float = 0.7, diagonal_percentage: float = 0.4, duration_threshold: int = 5,
                 min_cars_in_cluster: int = 8, cluster_proximity_multiplier: int = 3, congestion_respite_time: int = 10,
                 source_weights_path: str = 'traffic-monitoring\\gvtd.pt'):
        self.video_id = video_id
        self.model = YOLO(source_weights_path)
        self.confidence_threshold = confidence_threshold
        self.iou_threshold = iou_threshold
        self.box_annotator = sv.BoxAnnotator(color=self.COLORS, thickness=0)
        self.tracker = sv.ByteTrack()
        self.dot_annotator = sv.DotAnnotator()
        self.cluster_duration_tracker = {}
        self.initial_positions = {}
        self.res_wh = [res_width, res_height]
        self.diagonal_percentage = diagonal_percentage
        self.duration_threshold = duration_threshold
        self.min_cars_in_cluster = min_cars_in_cluster
        self.cluster_proximity_multiplier = cluster_proximity_multiplier
        self.congestion_flag = False
        self.post_congestion_frames = 0
        self.congestion_respite_frames = congestion_respite_time
        self.congestion_level = None
        self.congestion_cluster_size = 0

    def process_video(self, frame: np.ndarray):
        processed_frame, polygon, start_congestion_time, stop_congestion_time = self.process_frame(frame)
        # cv2.imshow("frame", processed_frame)
        self.set_congestion_level()  # Set the congestion level based on cluster size
        return polygon, start_congestion_time, stop_congestion_time, self.congestion_flag

    def process_frame(self, frame: np.ndarray):
        result = self.model(frame, verbose=False, conf=self.confidence_threshold, iou=self.iou_threshold)[0]
        detections = sv.Detections.from_ultralytics(result)
        detections = self.tracker.update_with_detections(detections)
        print(detections.tracker_id)

        # Initialize polygon to None
        polygon = None
        start_congestion_time = None
        stop_congestion_time = None

        annotated_frame, polygon = self.annotate_frame(frame, detections)

        # Check congestion status and update the flag and timer accordingly
        congestion_detected = self.detect_congestion(detections)
        if congestion_detected:
            if not self.congestion_flag:
                start_congestion_time = datetime.now()
                print(f"Congestion detected: Flag set to True at {start_congestion_time}")
                self.congestion_flag = True
            self.post_congestion_frames = 0  # Reset the respite timer every time congestion is detected
        else:
            if self.congestion_flag:
                if self.post_congestion_frames < self.congestion_respite_frames:
                    self.post_congestion_frames += 1
                else:
                    self.congestion_flag = False
                    self.post_congestion_frames = 0
                    stop_congestion_time = datetime.now()
                    print(f"Congestion no longer detected: Flag reset to False at {stop_congestion_time}")
                    start_congestion_time = None  # Reset the start_congestion_time
            else:
                start_congestion_time = None  # Reset the start_congestion_time if no congestion is detected

        return annotated_frame, polygon, start_congestion_time, stop_congestion_time
    
    def detect_congestion(self, detections):
        average_car_size = DetectionUtils.get_average_car_size(detections)
        clusters = DetectionUtils.identify_clusters(detections, average_car_size, self.cluster_proximity_multiplier)
        self.update_cluster_durations(clusters)
        

        return any(len(cluster) >= self.min_cars_in_cluster and all(self.cluster_duration_tracker.get(tracker_id, 0) >= self.duration_threshold for tracker_id in cluster) for cluster in clusters)

    def annotate_frame(self, frame: np.ndarray, detections: sv.Detections):
        annotated_frame = frame.copy()
        labels = [f"{self.CLASS_ID_TO_CLASS_NAME[class_id]} {track_id}" for class_id, track_id in zip(detections.class_id, detections.tracker_id)]
        annotated_frame = self.box_annotator.annotate(frame, detections, labels=labels)
        # annotated_frame = self.dot_annotator.annotate(frame, detections)

        average_car_size = DetectionUtils.get_average_car_size(detections)
        clusters = DetectionUtils.identify_clusters(detections, average_car_size, self.cluster_proximity_multiplier)
        self.update_cluster_durations(clusters)

        self.update_initial_positions(clusters, detections)
        stable_cars = self.check_position_stability(detections)

        annotated_frame, polygon = self.draw_cluster_boxes(annotated_frame, clusters, detections)
        return annotated_frame, polygon

    def update_cluster_durations(self, clusters):
        for cluster in clusters:
            for tracker_id in cluster:
                self.cluster_duration_tracker[tracker_id] = self.cluster_duration_tracker.get(tracker_id, 0) + 1

    def update_initial_positions(self, clusters, detections):
        centers = {detections.tracker_id[i]: ((det[2] + det[0]) / 2, (det[3] + det[1]) / 2) for i, det in enumerate(detections.xyxy)}
        for cluster in clusters:
            for tracker_id in cluster:
                if tracker_id not in self.initial_positions:
                    self.initial_positions[tracker_id] = centers[tracker_id]

    def check_position_stability(self, detections):
        stable_cars = []
        res_width = int(self.res_wh[0])
        res_height = int(self.res_wh[1])
        frame_diagonal = np.sqrt(res_width**2 + res_height**2)
        threshold_distance = self.diagonal_percentage * frame_diagonal
        for tracker_id, initial_position in self.initial_positions.items():
            if tracker_id in detections.tracker_id:
                current_position_index = list(detections.tracker_id).index(tracker_id)
                current_position = ((detections.xyxy[current_position_index][2] + detections.xyxy[current_position_index][0]) / 2,
                                    (detections.xyxy[current_position_index][3] + detections.xyxy[current_position_index][1]) / 2)
                if np.linalg.norm(np.array(initial_position) - np.array(current_position)) < threshold_distance:
                    stable_cars.append(tracker_id)
        return stable_cars

    def draw_cluster_boxes(self, frame, clusters, detections):
        polygon = None
        bgr_color = (0, 0, 0)
        for cluster in clusters:
            if len(cluster) >= self.min_cars_in_cluster and all(self.cluster_duration_tracker.get(tracker_id, 0) >= self.duration_threshold for tracker_id in cluster):
                min_x, min_y, max_x, max_y = self.calculate_cluster_bounds(cluster, detections)
                if min_x < float('inf') and max_x > 0:
                    polygon = np.array([[[min_x, min_y], [max_x, min_y], [max_x, max_y], [min_x, max_y]]], dtype=np.int32)
                    frame = cv2.polylines(frame, polygon, isClosed=True, color=bgr_color, thickness=2)

                    print(f"Congestion detected: {len(cluster)} vehicles in cluster")
                    self.congestion_cluster_size = len(cluster)
        return frame, polygon
    
    def set_congestion_level(self):
        if self.congestion_flag:
            # Set congestion level based on the number of cars
            if 5 <= self.congestion_cluster_size <= 7:
                self.congestion_level = 'LOW'
            elif 8 <= self.congestion_cluster_size <= 10:
                self.congestion_level = 'MEDIUM'
            elif self.congestion_cluster_size > 10:
                self.congestion_level = 'HIGH'
        else:
            self.congestion_level = None

    def calculate_cluster_bounds(self, cluster, detections):
        min_x, min_y, max_x, max_y = float('inf'), float('inf'), 0, 0
        for tracker_id in cluster:
            index = list(detections.tracker_id).index(tracker_id)
            bbox = detections.xyxy[index]
            min_x, min_y = min(min_x, bbox[0]), min(min_y, bbox[1])
            max_x, max_y = max(max_x, bbox[2]), max(max_y, bbox[3])
        return min_x, min_y, max_x, max_y

# Initialize the FastAPI app
app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the route to process frames
@app.post("/process")
async def process_frame(frame: UploadFile = File(...), video_id: str = Form(...), width: int = Form(...), height: int = Form(...)):
    try:
        # Extract the frame and additional information from the request
        file = await frame.read()
        image = Image.open(io.BytesIO(file))

        # Convert the image for processing
        frame = np.array(image)

        # Retrieve or create the VideoProcessor instance
        processor = get_video_processor(
            video_id,
            res_width=width,
            res_height=height,
        )

        # Unpack processed data from the processor
        polygon, start_congestion_time, stop_congestion_time, congestion_flag = processor.process_video(frame)

        # Construct the response
        response = {
            "success": True,
            "data": {
                "video_id": video_id,
                "congestion_start_time": start_congestion_time.isoformat() if start_congestion_time else None,
                "congestion_stop_time": stop_congestion_time.isoformat() if stop_congestion_time else None,
                "bounding_box": polygon.tolist() if polygon is not None else None,
                "is_congestion": congestion_flag,
                "congestion_level": processor.congestion_level
            },
            "error": None
        }
        return response
    except Exception as e:
        # Log the error
        error_msg = f"Error processing frame for video_id: {video_id}"
        logging.error(error_msg, exc_info=True)

        # Capture the full traceback
        traceback_msg = traceback.format_exc()

        # Return an error response
        error_response = {
            "success": False,
            "data": None,
            "error": {
                "message": str(e),
                "traceback": traceback_msg
            }
        }
        return error_response

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='127.0.0.1', port=5000)


# # version 2
# # version 2
