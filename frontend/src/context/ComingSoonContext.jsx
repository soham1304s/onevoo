import React, { createContext, useContext, useState } from 'react';
import ComingSoonModal from '../components/ComingSoonModal';

const ComingSoonContext = createContext();

export function ComingSoonProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const openComingSoon = (customData = {}) => {
    setModalData(customData);
    setIsOpen(true);
  };

  const closeComingSoon = () => {
    setIsOpen(false);
  };

  return (
    <ComingSoonContext.Provider value={{ openComingSoon, closeComingSoon, isOpen }}>
      {children}
      <ComingSoonModal
        isOpen={isOpen}
        onClose={closeComingSoon}
        modalData={modalData}
      />
    </ComingSoonContext.Provider>
  );
}

export function useComingSoon() {
  const context = useContext(ComingSoonContext);
  if (!context) {
    throw new Error('useComingSoon must be used within a ComingSoonProvider');
  }
  return context;
}
