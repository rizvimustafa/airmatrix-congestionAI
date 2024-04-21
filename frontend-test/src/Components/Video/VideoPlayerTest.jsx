// Import necessary React hooks and other utilities.
import React, { useRef, useEffect, useState } from 'react';
import img from '../Video/nocamera.jpg'; // Placeholder image for no camera input.
import './VideoPlayerTest.css'; // Stylesheet for video player styling.
import { useData } from '../../send-backend/dataContext'; // Custom hook to access shared data context.
import VideoFrameSender from '../../send-backend/sendBack'; // Component to send video frames to backend.

function VideoPlayerTest() {
  // Access video selection states from the shared data context.
  const { videoSelections } = useData();
  // Use a ref to keep track of video DOM elements without causing re-renders.
  const videoRefs = useRef([]);
  // State to manage actively playing videos.
  const [activeVideos, setActiveVideos] = useState([]);
  // Calculate the number of selected (active) videos.
  const selectedVideosCount = videoSelections.filter(Boolean).length;
  // Array of video source URLs.
  const videoSources = [
    `${process.env.PUBLIC_URL}/vid1.mp4`,
    `${process.env.PUBLIC_URL}/vid5.mp4`,
    `${process.env.PUBLIC_URL}/test_4.mp4`,
    `${process.env.PUBLIC_URL}/vid3.mp4`
  ];

  // Effect to update the list of active video elements whenever videoSelections change.
  useEffect(() => {
    const filteredVideos = videoSelections
      .map((isSelected, index) => isSelected ? videoRefs.current[index] : null) // Map over selections to get corresponding video refs.
      .filter(el => el !== null); // Filter out null values to get only active videos.
    setActiveVideos(filteredVideos); // Update state with the filtered list of active videos.
  }, [videoSelections]);

  // Render the video player interface.
  return (
    <>
      <div className={`box video-${selectedVideosCount}`}> 
        {/* Show a placeholder image if no videos are selected */}
        {selectedVideosCount === 0 && <img className='img' src={img} alt="No Camera Available" />}
        {/* Map over video selections and render videos if they are selected */}
        {videoSelections.map((isSelected, index) => isSelected && (
          <div key={index} className={`video-container video${index}`}>
            <video ref={el => videoRefs.current[index] = el} autoPlay muted loop> 
              <source src={videoSources[index]} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ))}
      </div>

      {/* Map over active videos and render VideoFrameSender components for each */}
      {activeVideos.map((videoElement, index) => {
        if (!videoElement) return null;
        const containerSize = videoElement.getBoundingClientRect(); // Get video dimensions for frame sending.
        const videoId = `${index}`; // Generate a unique ID based on index.

        return (
          <VideoFrameSender
            key={index}
            videoElement={videoElement}
            containerSize={containerSize}
            videoId={videoId}
          />
        );
      })}
    </>
  );
}

export default VideoPlayerTest;

