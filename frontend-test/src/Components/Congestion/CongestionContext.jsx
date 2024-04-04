import React, { createContext, useContext, useState } from 'react';

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
