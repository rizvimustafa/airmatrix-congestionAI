import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [centerData, setCenterData] = useState([]);
  const [responseData, setResponseData] = useState(null); 
  const [videoSelections, setVideoSelections] = useState([false, false, false, false]);
  const [cong, checkCong] = useState(false)

  const toggleVideo = (index) => {
    setVideoSelections(prev => {
        const newSelections = [...prev];
        newSelections[index] = !newSelections[index];
        return newSelections;
    });
};
  return (
    <DataContext.Provider value={{ centerData, setCenterData, responseData, setResponseData, videoSelections, setVideoSelections, toggleVideo, cong, checkCong}}>
      {children}
    </DataContext.Provider>
  );
};

// Custom hook to use the context
export const useData = () => useContext(DataContext);
