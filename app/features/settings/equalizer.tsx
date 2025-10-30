
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Slider from '@react-native-assets/slider';
import { usePlaybackSettings } from '@/context/PlaybackSettingsContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const EqualizerScreen = () => {
  const { equalizer, setPlaybackSetting } = usePlaybackSettings();

  const bands = ['60Hz', '150Hz', '400Hz', '1kHz', '2.4kHz', '6kHz', '10kHz', '12kHz', '14kHz', '16kHz'];

  const handleSliderChange = (value: number, index: number) => {
    const newEqualizer = [...equalizer];
    newEqualizer[index] = value;
    setPlaybackSetting('equalizer', newEqualizer);
  };

  const handleFlat = () => {
    setPlaybackSetting('equalizer', Array(10).fill(0));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Equalizer</Text>
        <TouchableOpacity onPress={handleFlat}>
          <Text style={styles.flatButton}>Flat</Text>
        </TouchableOpacity>
      </View>

      {bands.map((band, index) => (
        <View key={index} style={styles.sliderContainer}>
          <Text style={styles.bandText}>{band}</Text>
          <Slider
            style={styles.slider}
            minimumValue={-12}
            maximumValue={12}
            step={1}
            value={equalizer[index]}
            onValueChange={(value) => handleSliderChange(value, index)}
            minimumTrackTintColor="#A78BFA"
            maximumTrackTintColor="#3e3e3e"
            thumbTintColor="#fff"
          />
          <Text style={styles.valueText}>{equalizer[index]}dB</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  flatButton: {
    color: '#A78BFA',
    fontSize: 16,
  },
  sliderContainer: {
    marginBottom: 20,
  },
  bandText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  valueText: {
    color: '#fff',
    textAlign: 'right',
  },
});

export default EqualizerScreen;
