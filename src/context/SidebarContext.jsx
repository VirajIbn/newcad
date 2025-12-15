import React, { createContext, useContext, useState } from 'react';

const SidebarContext = createContext();

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export const SidebarProvider = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleSidebar = () => {
    setIsCollapsed(prev => !prev);
  };

  const expandSidebar = () => {
    setIsCollapsed(false);
  };

  const collapseSidebar = () => {
    setIsCollapsed(true);
  };

  const value = {
    isCollapsed,
    toggleSidebar,
    expandSidebar,
    collapseSidebar
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};
