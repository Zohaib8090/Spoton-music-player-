
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';

const AudioContext = createContext(null);

export const AudioProvider = ({ children }) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    if (user) {
      const db = getFirestore();
      const userRef = doc(db, 'users', user.uid);
      const unsubscribe = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          const userSettings = doc.data();
          setSettings(userSettings);
        }
      });
      return () => unsubscribe();
    }
  }, [user]);

  const value = {
    isPlayerReady: false,
    playbackState: null,
    settings,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};

export const useAudio = () => useContext(AudioContext);
