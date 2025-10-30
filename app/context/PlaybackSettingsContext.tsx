
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as AudioService from '@/services/AudioService';

const PlaybackSettingsContext = createContext();

export const usePlaybackSettings = () => useContext(PlaybackSettingsContext);

export const PlaybackSettingsProvider = ({ children }) => {
  const [playbackSettings, setPlaybackSettings] = useState({
    equalizer: Array(10).fill(0),
    reverb: 'none',
    bassBoost: false,
    crossfade: 0,
    mono: false,
  });

  const setPlaybackSetting = (key, value) => {
    setPlaybackSettings(prevSettings => ({
      ...prevSettings,
      [key]: value,
    }));
  };

  useEffect(() => {
    AudioService.applyEqualizer(playbackSettings.equalizer);
  }, [playbackSettings.equalizer]);

  return (
    <PlaybackSettingsContext.Provider value={{ ...playbackSettings, setPlaybackSetting, playSound: AudioService.playSound }}>
      {children}
    </PlaybackSettingsContext.Provider>
  );
};
