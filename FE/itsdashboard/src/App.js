import React from 'react';
import ReactDOM from 'react-dom';
import VideoPlayer from './VideoPlayer/VideoPlayer.jsx'; // Adjust the path as necessary
import './App.css';   
import Top from './Top/top';
import Nav from './Nav/nav';
import { CongestionProvider } from './Congestion/CongestionContext'; // Adjust the path as necessary

import { DataProvider } from './sendBackEnd/dataContext';

function App() {
  return (
    <div className="App">
   
    <Top/>
   

    <Nav/>
  
    
    <DataProvider>
    <CongestionProvider>
    <VideoPlayer />
    </CongestionProvider>
    </DataProvider>
    
    
    
      
      
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
export default App;
