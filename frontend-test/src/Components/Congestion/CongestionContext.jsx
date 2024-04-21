// Import necessary hooks from React for creating context and managing state.
import React, { createContext, useContext, useState } from 'react';

// Create a new context for managing congestion information. This is initially undefined.
const CongestionContext = createContext();

// Custom hook to provide easy access to the CongestionContext from any component that needs it.
export const useCongestion = () => useContext(CongestionContext);

// Provider component that wraps children components to provide them access to congestion states.
export const CongestionProvider = ({ children }) => {
  // State to keep track of congestion states, stored as an object with video IDs as keys.
  const [congestionStates, setCongestionStates] = useState({});

  // Function to update the congestion state for a specific video ID.
  const updateCongestionState = (videoId, isCongested) => {
    // Update the state with the new congestion value for the given video ID.
    setCongestionStates((prevStates) => ({
      ...prevStates, // Spread the previous states to maintain other entries.
      [videoId]: isCongested, // Dynamically update the state for the specific videoId.
    }));
  };

  // Render the context provider with the state and updater function passed down via the value prop.
  return (
    <CongestionContext.Provider value={{ congestionStates, updateCongestionState }}>
      {children} {/*This allows any child components to access the context.*/}
    </CongestionContext.Provider>
  );
};
