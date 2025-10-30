
import { Audio } from 'expo-av';

let sound: Audio.Sound | null = null;

/*
export const playSound = async () => {
  if (sound) {
    await sound.unloadAsync();
    sound = null;
  }

  const { sound: newSound } = await Audio.Sound.createAsync(
    require('@/assets/audio/test.mp3'),
  );
  sound = newSound;
  await sound.playAsync();
};
*/

export const applyEqualizer = async (equalizer: number[]) => {
  if (sound) {
    await sound.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
    // @ts-ignore
    await sound.setEqualizer(equalizer);
  }
};
