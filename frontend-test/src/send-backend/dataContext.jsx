// Importing React and necessary hooks for managing context and state.
import React, { createContext, useContext, useState } from 'react';

// Creating a new context for data management across the React application.
const DataContext = createContext();

// DataProvider component that provides context values to nested child components.
export const DataProvider = ({ children }) => {
  // State for managing center-related data.
  const [centerData, setCenterData] = useState([]);
  // State for managing response data from server or other sources.
  const [responseData, setResponseData] = useState(null); 
  // State for tracking which videos are selected, initialized with all unselected.
  const [videoSelections, setVideoSelections] = useState([false, false, false, false]);
  // State to check congestion status, initialized to false.
  const [cong, checkCong] = useState(false);

  // Function to toggle the selection status of videos based on their index.
  const toggleVideo = (index) => {
    setVideoSelections(prev => {
        const newSelections = [...prev];
        newSelections[index] = !newSelections[index]; // Toggle the boolean value at the given index.
        return newSelections;
    });
  };

  // The context provider component renders its children and provides them with context data.
  return (
    <DataContext.Provider value={{
      centerData, setCenterData, responseData, setResponseData,
      videoSelections, setVideoSelections, toggleVideo, cong, checkCong
    }}>
    
      {children}
    </DataContext.Provider>
  );
};

// Custom hook to use the data context in other components easily.
export const useData = () => useContext(DataContext);
