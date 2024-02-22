import argparse
import numpy as np
import supervision as sv
import cv2
import threading
from ultralytics import YOLO
from typing import List, Tuple, Dict, Set
from queue import Queue

# Set the path to the weights file as a constant
SOURCE_WEIGHTS_PATH = 'gvtd.pt'

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
        print("All Clusters:", clusters_list)
        return clusters_list    

class VideoProcessor:
    """Class for processing video data."""

    CLASS_ID_TO_CLASS_NAME = ['bicycle', 'bus', 'car', 'motcycle', 'ped', 'truck', 'van']
    COLORS = sv.ColorPalette.default()

    def __init__(self, source_video_path: str, target_video_path: str = None,
                 confidence_threshold: float = 0.5, iou_threshold: float = 0.7, diagonal_percentage: float = 0.1,
                 duration_threshold: int = 10, min_cars_in_cluster: int = 10, cluster_proximity_multiplier: float = 2):
        self.source_video_path = source_video_path
        self.target_video_path = target_video_path
        self.confidence_threshold = confidence_threshold
        self.iou_threshold = iou_threshold
        self.box_annotator = sv.BoxAnnotator(color=self.COLORS, thickness=0)
        self.tracker = sv.ByteTrack()
        self.video_info = sv.VideoInfo.from_video_path(video_path=source_video_path)
        self.dot_annotator = sv.DotAnnotator()
        self.cluster_duration_tracker = {}
        self.video_capture = cv2.VideoCapture(source_video_path)
        self.frame_rate = self.video_capture.get(cv2.CAP_PROP_FPS)
        self.initial_positions = {}
        self.diagonal_percentage = diagonal_percentage
        self.duration_threshold = duration_threshold * self.frame_rate
        self.min_cars_in_cluster = min_cars_in_cluster
        self.cluster_proximity_multiplier = cluster_proximity_multiplier

    def process_video(self):
        frame_generator = sv.get_video_frames_generator(source_path=self.source_video_path)
        for frame in frame_generator:
            processed_frame = self.process_frame(frame)
            cv2.imshow("frame", processed_frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
        cv2.destroyAllWindows()

    def process_frame(self, frame: np.ndarray):
        result = self.model(frame, verbose=False, conf=self.confidence_threshold, iou=self.iou_threshold)[0]
        detections = sv.Detections.from_ultralytics(result)
        detections = self.tracker.update_with_detections(detections)
        return self.annotate_frame(frame, detections)

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
        annotated_frame = self.draw_cluster_boxes(annotated_frame, clusters, detections)
        return annotated_frame

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
        frame_diagonal = np.sqrt(self.video_info.resolution_wh[0]**2 + self.video_info.resolution_wh[1]**2)
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
        bgr_color = (0, 0, 255)
        for cluster in clusters:
            if len(cluster) >= self.min_cars_in_cluster and all(self.cluster_duration_tracker.get(tracker_id, 0) >= self.duration_threshold for tracker_id in cluster):
                min_x, min_y, max_x, max_y = self.calculate_cluster_bounds(cluster, detections)
                if min_x < float('inf') and max_x > 0:
                    polygon = np.array([[[min_x, min_y], [max_x, min_y], [max_x, max_y], [min_x, max_y]]], dtype=np.int32)
                    frame = cv2.polylines(frame, polygon, isClosed=True, color=bgr_color, thickness=2)
        return frame

    def calculate_cluster_bounds(self, cluster, detections):
        min_x, min_y, max_x, max_y = float('inf'), float('inf'), 0, 0
        for tracker_id in cluster:
            index = list(detections.tracker_id).index(tracker_id)
            bbox = detections.xyxy[index]
            min_x, min_y = min(min_x, bbox[0]), min(min_y, bbox[1])
            max_x, max_y = max(max_x, bbox[2]), max(max_y, bbox[3])
        return min_x, min_y, max_x, max_y
    
    def set_model(self, model):
        self.model = model

def process_video_stream(video_path, diagonal_percentage, duration_threshold, min_cars_in_cluster, cluster_proximity_multiplier, window_name, frame_queue):
    # Instantiate a new model inside the thread  using SOURCE_WEIGHTS_PATH directly
    
    local_model = YOLO(SOURCE_WEIGHTS_PATH)

    processor = VideoProcessor(
        source_video_path=video_path,
        diagonal_percentage=diagonal_percentage,
        duration_threshold=duration_threshold,
        min_cars_in_cluster=min_cars_in_cluster,
        cluster_proximity_multiplier=cluster_proximity_multiplier
    )

    # Set the model for this processor instance
    processor.set_model(local_model)

    cap = cv2.VideoCapture(video_path)

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        processed_frame = processor.process_frame(frame)
        frame_queue.put((processed_frame, video_path))  # Include video path or identifier if needed

    cap.release()

def display_frames(frame_queue, display_width):
    while True:
        if not frame_queue.empty():
            frame, window_name = frame_queue.get()
            # Calculate the ratio of the new width to the old width
            ratio = display_width / frame.shape[1]
            # New dimensions
            new_width = display_width
            new_height = int(frame.shape[0] * ratio)
            # Resize the frame
            resized_frame = cv2.resize(frame, (new_width, new_height))
            cv2.imshow(window_name, resized_frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

def main():
    frame_queue = Queue()
    display_width = 640
    video_configs = [
        # Each tuple contains the configurations for each video
        # (video_path, diagonal_percentage, duration_threshold, min_cars_in_cluster, cluster_proximity_multiplier, window_name)
        ('optim_test_videos/t1.mp4', 0.1, 0.5, 3, 3, "Camera 1"),
        ('optim_test_videos/t2.mp4', 0.1, 0.5, 3, 3, "Camera 2"),
        # ('optim_test_videos/t3.mp4', 0.1, 2, 3, 3, "Camera 3"),
        # ('optim_test_videos/t4.mp4', 0.1, 2, 3, 3, "Camera 4"),
        # ('optim_test_videos/t5.mp4', 0.1, 2, 3, 3, "Camera 5"),
        # Add more configurations as needed
    ]
    threads = [threading.Thread(target=process_video_stream, args=(*config, frame_queue)) for config in video_configs]

    for t in threads:
        t.start()

    display_frames(frame_queue, display_width)

    for t in threads:
        t.join()

    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()

    