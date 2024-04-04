import { useEffect, useState } from 'react';
import { useData } from './dataContext';
import { useCongestion } from '../Components/Congestion/CongestionContext';

function VideoFrameSender({ videoElement, containerSize, videoId }) {
  const { updateCongestionState } = useCongestion(); // Using the context to get the update function
  const [isCongested, setIsCongested] = useState(false);
  const [congestionLevel, setCongestionLevel] = useState("");
  const {setResponseData} = useData();


  const sendFrameAndSize = () => {
    if (!videoElement) console.log(videoElement); // Check if videoElement is defined


    console.log("Video Element: " + videoElement);
    console.log("container size: " + containerSize);
    console.log("Video ID: " + videoId);

    console.log('----------------------------------------------------');
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    console.log('----------------------------------------------------');

    console.log("VIDEO ELEMENT:" + videoElement)
    console.log("CANVAS WIDTH: " + videoElement.videoWidth)
    console.log("CANVAS HEIGHT: " + videoElement.videoHeight)
    canvas.toBlob(blob => {
      const formData = new FormData();
      formData.append('frame', blob, 'frame.jpg');
      formData.append('video_id', videoId);
      formData.append('width', Math.round(containerSize.width));
      formData.append('height', Math.round(containerSize.height));


      console.log('----------------------------------------------------');
      console.log("VIDEO ID: " + videoId);
      console.log("CONTAINER WIDTH :" + Math.round(containerSize.width));
      console.log("CONTAINER HEIGHT : " + Math.round(containerSize.height));


      fetch('http://localhost:5000/process', {
        method: 'POST',
        body: formData,
      })
      .then(response => {
        // console.log("RESPONSE" + response.json());
        return response.json();
    })
      .then(data => {
        // console.log("DATA" + data);
        setResponseData(data)
        if (data.success && data.data && data.data.is_congestion) {
          console.log('Congestion is true for videoId:', videoId);
          console.log("congestion level: ", data.data.congestion_level)
          // // console.log(data);
          // console.log(data.data.is_congestion)
          updateCongestionState(videoId, true); // Update global state to indicate congestion
          setCongestionLevel(data.data.congestion_level);
          setIsCongested(true);
        } else {
          console.log('Congestion is false for videoId:', videoId);
          updateCongestionState(videoId, false); // Update global state to indicate no congestion
        
          // console.log(data.data.is_congestion)
          setIsCongested(false);
          setCongestionLevel("");
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }, 'image/jpeg');
  };

  useEffect(() => {
    const intervalId = setInterval(sendFrameAndSize, 5000);
    return () => clearInterval(intervalId);
  }, [videoElement, containerSize, videoId]);

  useEffect(() => {
    const videoIdElement = document.querySelector(`.video${videoId}`);
    console.log(videoIdElement); 
    if (videoIdElement) {
      let borderColor = 'none'; 
      if (isCongested) {
        switch(congestionLevel) {
          case "HIGH":
            borderColor = '1px solid red';
            break;
          case "MEDIUM":
            borderColor = '1px solid orange';
            break;
          case "LOW":
            borderColor = '1px solid yellow';
            break;
          default:
            borderColor = 'none'; 
        }
      }
      videoIdElement.style.border = borderColor;
    }
  }, [isCongested, congestionLevel, videoId]);

  return null;
}

export default VideoFrameSender;