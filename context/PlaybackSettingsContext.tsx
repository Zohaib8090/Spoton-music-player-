
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type AudioQuality = 'Automatic' | 'Very High' | 'High' | 'Standard' | 'Low';
export type VideoQuality = 'Automatic' | 'Very High' | 'High' | 'Standard' | 'Low';

interface PlaybackSettings {
  autoPlay: boolean;
  monoAudio: boolean;
  audioBalance: number;
  volumeNormalization: boolean;
  gaplessPlayback: boolean;
  automix: boolean;
  crossfade: number;
  wifiAudioQuality: AudioQuality;
  cellularAudioQuality: AudioQuality;
  wifiVideoQuality: VideoQuality;
  cellularVideoQuality: VideoQuality;
  equalizer: number[];
  setPlaybackSetting: <K extends keyof PlaybackSettings>(key: K, value: PlaybackSettings[K]) => void;
}

const PlaybackSettingsContext = createContext<PlaybackSettings | undefined>(undefined);

export const PlaybackSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Omit<PlaybackSettings, 'setPlaybackSetting'>>({
    autoPlay: true,
    monoAudio: false,
    audioBalance: 0,
    volumeNormalization: false,
    gaplessPlayback: true,
    automix: false,
    crossfade: 0,
    wifiAudioQuality: 'Automatic',
    cellularAudioQuality: 'Automatic',
    wifiVideoQuality: 'Automatic',
    cellularVideoQuality: 'Standard',
    equalizer: Array(10).fill(0),
  });

  const setPlaybackSetting = <K extends keyof PlaybackSettings>(key: K, value: PlaybackSettings[K]) => {
    setSettings(prevSettings => ({ ...prevSettings, [key]: value }));
  };

  return (
    <PlaybackSettingsContext.Provider value={{ ...settings, setPlaybackSetting }}>
      {children}
    </PlaybackSettingsContext.Provider>
  );
};

export const usePlaybackSettings = () => {
  const context = useContext(PlaybackSettingsContext);
  if (context === undefined) {
    throw new Error('usePlaybackSettings must be used within a PlaybackSettingsProvider');
  }
  return context;
};
