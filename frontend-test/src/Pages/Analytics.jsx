import React from 'react';
import Navbar from '../Components/Navbar/Navbar';
import Top from '../Components/Top/top';
import AverageDelayTime from '../Components/Analytics/AverageDelayTime/AverageDelayTime';
import AverageQueueLength from '../Components/Analytics/AverageQueueLength/AverageQueueLength';
import TotalDetections from '../Components/Analytics/TotalDetections/TotalDetections';
import BarChart from '../Components/Analytics/BarChart/BarChart';
import PieChart from '../Components/Analytics/PieChart/PieChart';
import LineChart from '../Components/Analytics/LineChart/LineChart';
import DateDownloadButton from '../Components/Analytics/DateDownloadButton/Date&DownloadButton'

function Analytics() {
  return (
    <>
      <Top title='Analytics'/>
      <Navbar/>
      <DateDownloadButton/>
      <TotalDetections/>
      <AverageDelayTime/>
      <AverageQueueLength/>
      <PieChart/>
      <BarChart/>
      <LineChart/>
      
      
    </>
  )
}

export default Analytics