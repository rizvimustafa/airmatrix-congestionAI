import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [centerData, setCenterData] = useState([]);
  const [responseData, setResponseData] = useState(null); // Add this line

  return (
    <DataContext.Provider value={{ centerData, setCenterData, responseData, setResponseData }}> {/* Update this line */}
      {children}
    </DataContext.Provider>
  );
};

// Custom hook to use the context
export const useData = () => useContext(DataContext);
