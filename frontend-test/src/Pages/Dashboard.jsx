import React from 'react'
import Navbar from '../Components/Navbar/Navbar';
import Top from '../Components/Top/top';
import VideoPlayerTest from '../Components/Video/VideoPlayerTest';
import CameraList from '../Components/CameraListView/CameraList';
import Buttons from '../Components/LoneButtons/Buttons' 
import { DataProvider } from '../send-backend/dataContext';
import { CongestionProvider } from '../Components/Congestion/CongestionContext';
import Reports from '../Components/Congestion/congTest';


function Dashboard() {
  return (
    <div>
    <DataProvider>
    <CongestionProvider>
      <Top title ='Congestion AI'/>
      <Navbar/>
      <Buttons/>
      <VideoPlayerTest/>
      <CameraList/>
    </CongestionProvider>
    </DataProvider>
    </div>
  )
}

export default Dashboard