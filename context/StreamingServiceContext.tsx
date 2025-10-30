
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type StreamingService = 'youtube' | 'spotify';

interface StreamingServiceContextType {
  selectedService: StreamingService | null;
  selectService: (service: StreamingService | null) => void;
}

const StreamingServiceContext = createContext<StreamingServiceContextType | undefined>(undefined);

export const StreamingServiceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedService, setSelectedService] = useState<StreamingService | null>(null);

  return (
    <StreamingServiceContext.Provider value={{ selectedService, selectService: setSelectedService }}>
      {children}
    </StreamingServiceContext.Provider>
  );
};

export const useStreamingService = () => {
  const context = useContext(StreamingServiceContext);
  if (context === undefined) {
    throw new Error('useStreamingService must be used within a StreamingServiceProvider');
  }
  return context;
};
