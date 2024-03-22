import React, { createContext, useContext, useState } from 'react';
import VideoPlayer from '../VideoPlayer/VideoPlayer';

const CongestionContext = createContext();

export const useCongestion = () => useContext(CongestionContext);

export const CongestionProvider = ({ children }) => {
  const [congestionStates, setCongestionStates] = useState({});

  const updateCongestionState = (videoId, isCongested) => {
    setCongestionStates((prevStates) => ({
      ...prevStates,
      [videoId]: isCongested,
    }));
  };

  return (
    <CongestionContext.Provider value={{ congestionStates, updateCongestionState }}>
      {children}
    </CongestionContext.Provider>
  );
};


 // Add border to the dynamically selected div