
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { openDrawer } from 'expo-router/drawer';
import Slider from '@react-native-assets/slider';
import { useStreamingService, StreamingService } from '@/context/StreamingServiceContext';
import { usePlaybackSettings, AudioQuality, VideoQuality } from '@/context/PlaybackSettingsContext';
import { useNotifications } from '@/context/NotificationsContext';
import { router } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';

const SettingsSection = ({ title, description, children }) => (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <Text style={styles.sectionDescription}>{description}</Text>
    <View style={styles.card}>{children}</View>
  </View>
);

const RadioButton = ({ label, selected, onSelect }) => (
  <TouchableOpacity style={styles.radioButtonContainer} onPress={onSelect}>
    <View style={[styles.radioButton, selected && styles.radioButtonSelected]} />
    <Text style={styles.radioButtonLabel}>{label}</Text>
  </TouchableOpacity>
);

const SettingsScreen = () => {
  const { selectedService, selectService } = useStreamingService();
  const {
    autoPlay,
    monoAudio,
    audioBalance,
    volumeNormalization,
    gaplessPlayback,
    automix,
    crossfade,
    wifiAudioQuality,
    cellularAudioQuality,
    wifiVideoQuality,
    cellularVideoQuality,
    setPlaybackSetting,
  } = usePlaybackSettings();
  const { newReleases, playlistUpdates, setNotificationSetting } = useNotifications();
  const { colorScheme, setColorScheme } = useColorScheme();

  const handleServiceToggle = (service: StreamingService) => {
    if (selectedService === service) {
      selectService(null);
    } else {
      selectService(service);
    }
  };

  const handleEqualizer = () => {
    router.push('/features/settings/equalizer');
  };

  const handleSupport = () => {
    Linking.openURL('mailto:zohaibbaig144@gmail.com');
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.menuButton} onPress={openDrawer}>
        <Ionicons name="menu" size={32} color="white" />
      </TouchableOpacity>
      <Text style={styles.mainTitle}>Settings</Text>

      <SettingsSection title="Playback" description="Adjust your streaming quality and transitions.">
        <Text style={styles.subSectionTitle}>Listening Control</Text>
        <View style={styles.settingRow}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>Auto Play</Text>
            <Text style={styles.settingDescription}>Keep the music going when your current selection ends.</Text>
          </View>
          <Switch
            trackColor={{ false: '#3e3e3e', true: '#A78BFA' }}
            thumbColor={autoPlay ? '#f4f3f4' : '#f4f3f4'}
            onValueChange={(value) => setPlaybackSetting('autoPlay', value)}
            value={autoPlay}
          />
        </View>
        <View style={styles.separator} />
        <View style={styles.settingRow}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>Mono Audio</Text>
            <Text style={styles.settingDescription}>Merge stereo channels into a single mono stream.</Text>
          </View>
          <Switch
            trackColor={{ false: '#3e3e3e', true: '#A78BFA' }}
            thumbColor={monoAudio ? '#f4f3f4' : '#f4f3f4'}
            onValueChange={(value) => setPlaybackSetting('monoAudio', value)}
            value={monoAudio}
          />
        </View>
        <View style={styles.separator} />
        <View style={styles.settingRowColumn}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>Audio Balance</Text>
            <Text style={styles.settingDescription}>Adjust the balance between the left and right channels.</Text>
          </View>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={-1}
            maximumValue={1}
            step={0.1}
            value={audioBalance}
            onValueChange={(value) => setPlaybackSetting('audioBalance', value)}
            minimumTrackTintColor="#A78BFA"
            maximumTrackTintColor="#3e3e3e"
            thumbTintColor="#fff"
          />
        </View>
        <View style={styles.separator} />
        <View style={styles.settingRow}>
          <TouchableOpacity style={styles.button} onPress={handleEqualizer}>
            <Text style={styles.buttonText}>Equalizer</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.separator} />
        <View style={styles.settingRow}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>Volume Normalization</Text>
            <Text style={styles.settingDescription}>Ensure a consistent volume level across all tracks.</Text>
          </View>
          <Switch
            trackColor={{ false: '#3e3e3e', true: '#A78BFA' }}
            thumbColor={volumeNormalization ? '#f4f3f4' : '#f4f3f4'}
            onValueChange={(value) => setPlaybackSetting('volumeNormalization', value)}
            value={volumeNormalization}
          />
        </View>
      </SettingsSection>

      <SettingsSection title="Notifications" description="Manage your notification preferences.">
        <View style={styles.settingRow}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>New Releases</Text>
            <Text style={styles.settingDescription}>Get notified about new music from artists you follow.</Text>
          </View>
          <Switch
            trackColor={{ false: '#3e3e3e', true: '#A78BFA' }}
            thumbColor={newReleases ? '#f4f3f4' : '#f4f3f4'}
            onValueChange={(value) => setNotificationSetting('newReleases', value)}
            value={newReleases}
          />
        </View>
        <View style={styles.separator} />
        <View style={styles.settingRow}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>Playlist Updates</Text>
            <Text style={styles.settingDescription}>Get notified when playlists you follow are updated.</Text>
          </View>
          <Switch
            trackColor={{ false: '#3e3e3e', true: '#A78BFA' }}
            thumbColor={playlistUpdates ? '#f4f3f4' : '#f4f3f4'}
            onValueChange={(value) => setNotificationSetting('playlistUpdates', value)}
            value={playlistUpdates}
          />
        </View>
      </SettingsSection>

      <SettingsSection title="Appearance" description="Customize the look and feel of the app.">
        <View style={styles.settingRow}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>Dark Mode</Text>
            <Text style={styles.settingDescription}>Enable or disable the dark theme.</Text>
          </View>
          <Switch
            trackColor={{ false: '#3e3e3e', true: '#A78BFA' }}
            thumbColor={colorScheme === 'dark' ? '#f4f3f4' : '#f4f3f4'}
            onValueChange={(value) => setColorScheme(value ? 'dark' : 'light')}
            value={colorScheme === 'dark'}
          />
        </View>
      </SettingsSection>

      <SettingsSection title="Developer Support" description="Get help with issues or provide feedback.">
        <View style={styles.settingRow}>
          <TouchableOpacity style={styles.button} onPress={handleSupport}>
            <Text style={styles.buttonText}>Contact Us</Text>
          </TouchableOpacity>
        </View>
      </SettingsSection>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 24,
  },
  menuButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  mainTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 80,
    marginBottom: 20,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  sectionDescription: {
    color: '#A9A9A9',
    fontSize: 14,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 8,
    padding: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  settingTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingDescription: {
    color: '#A9A9A9',
    fontSize: 12,
    marginTop: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 10,
  },
  subSectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  subSection: {
    marginBottom: 10,
  },
  streamingType: {
    color: '#A9A9A9',
    fontSize: 14,
    marginBottom: 10,
    marginLeft: 15,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    marginLeft: 15,
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#A9A9A9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  radioButtonSelected: {
    borderColor: '#A78BFA',
    backgroundColor: '#A78BFA',
  },
  radioButtonLabel: {
    color: '#fff',
    fontSize: 16,
  },
  settingRowColumn: {
    paddingVertical: 10,
  },
  sliderValue: {
    color: '#fff',
    textAlign: 'right',
    marginTop: -10,
  },
  button: {
    backgroundColor: '#A78BFA',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
