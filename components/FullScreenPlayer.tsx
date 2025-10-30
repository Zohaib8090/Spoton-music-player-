
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import ImageColors from 'react-native-image-colors';
import { RepeatMode } from 'react-native-track-player';
import { WebView } from 'react-native-webview';
import { router } from 'expo-router';
import MarqueeText from '@/components/MarqueeText';

const FullScreenPlayer = ({
  song,
  isVisible,
  onClose,
  onPlayPause,
  onSkipNext,
  onSkipPrevious,
  progress,
  onShuffle,
  onRepeat,
  isShuffleEnabled,
  repeatMode,
  onLike,
  onDislike,
  onComment,
  onSave,
  onToggleVideo,
  onMoreOptions,
  queue,
  activeTab,
  onTabChange,
  onCast,
  lyrics,
  lyricsLoading,
  relatedSongs,
  relatedSongsLoading,
  likes,
  dislikes,
  isVideo,
}) => {
  const [backgroundColor, setBackgroundColor] = useState('#2C2C2E');

  useEffect(() => {
    if (song && song.artwork) {
      ImageColors.getColors(song.artwork, { fallback: '#2C2C2E' }).then((colors) => {
        setBackgroundColor(colors.darkVibrant || colors.darkMuted || colors.dominant || '#2C2C2E');
      });
    }
  }, [song]);

  if (!isVisible || !song) {
    return null;
  }

  const handleArtistPress = () => {
    router.push(`/artist/${song.artist}`);
  };

  const renderRepeatIcon = () => {
    let iconName = 'repeat';
    let iconColor = 'white';
    if (repeatMode === RepeatMode.Track) {
      iconName = 'repeat-once';
      iconColor = '#1DB954'; // Active color
    } else if (repeatMode === RepeatMode.Queue) {
      iconName = 'repeat';
      iconColor = '#1DB954'; // Active color
    }
    return <MaterialCommunityIcons name={iconName} size={32} color={iconColor} />;
  };

  const renderTabContent = () => {
    if (isVideo) {
        return (
            <WebView
                style={styles.video}
                source={{ uri: `https://www.youtube.com/embed/${song.id}?autoplay=1` }}
                allowsFullscreenVideo
            />
        )
    }
    switch (activeTab) {
      case 'Up Next':
        return (
          <FlatList
            data={queue}
            keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
            renderItem={({ item }) => (
              <View style={styles.queueItem}>
                <Image source={{ uri: item.artwork }} style={styles.queueAlbumArt} />
                <View style={styles.queueSongInfo}>
                  <Text style={styles.queueSongTitle}>{item.title}</Text>
                  <Text style={styles.queueArtistName}>{item.artist}</Text>
                </View>
              </View>
            )}
          />
        );
      case 'Lyrics':
        if (lyricsLoading) {
          return (
            <View style={styles.tabContentContainer}>
              <ActivityIndicator size="large" color="white" />
            </View>
          );
        }
        return (
          <ScrollView contentContainerStyle={styles.tabContentContainer}>
            <Text style={styles.tabContentText}>{lyrics}</Text>
          </ScrollView>
        );
      case 'Related':
        if (relatedSongsLoading) {
          return (
            <View style={styles.tabContentContainer}>
              <ActivityIndicator size="large" color="white" />
            </View>
          );
        }
        if (relatedSongs && relatedSongs.length > 0) {
          return (
            <FlatList
              data={relatedSongs}
              keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
              renderItem={({ item }) => (
                <View style={styles.queueItem}>
                  <Image source={{ uri: item.artwork }} style={styles.queueAlbumArt} />
                  <View style={styles.queueSongInfo}>
                    <Text style={styles.queueSongTitle}>{item.title}</Text>
                    <Text style={styles.queueArtistName}>{item.artist}</Text>
                  </View>
                </View>
              )}
            />
          );
        }
        return (
          <View style={styles.tabContentContainer}>
            <Text style={styles.tabContentText}>No related songs found.</Text>
          </View>
        );
      default:
        return (
          <>
            <Image source={{ uri: song.artwork }} style={styles.albumArt} />
            <View style={styles.songDetails}>
              <MarqueeText text={song.title} style={styles.title} />
              <TouchableOpacity onPress={handleArtistPress}>
                <MarqueeText text={song.artist} style={styles.artist} />
              </TouchableOpacity>
            </View>
          </>
        );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Ionicons name="chevron-down" size={32} color="white" />
      </TouchableOpacity>

      <View style={styles.header}>
        <View style={styles.toggleContainer}>
            <TouchableOpacity style={[styles.toggleButton, !isVideo && styles.activeToggle]} onPress={onToggleVideo}>
                <Text style={styles.toggleText}>Song</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.toggleButton, isVideo && styles.activeToggle]} onPress={onToggleVideo}>
                <Text style={styles.toggleText}>Video</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={onCast}>
            <Ionicons name="cast" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onMoreOptions}>
            <MaterialCommunityIcons name="dots-vertical" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.mainContent}>{renderTabContent()}</View>

      <View style={styles.bottomContainer}>
        <View style={styles.feedbackContainer}>
          <TouchableOpacity style={styles.feedbackButton} onPress={onLike}>
            <Ionicons name="thumbs-up-outline" size={24} color="white" />
            <Text style={styles.feedbackCount}>{likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.feedbackButton} onPress={onDislike}>
            <Ionicons name="thumbs-down-outline" size={24} color="white" />
            <Text style={styles.feedbackCount}>{dislikes}</Text>
          </TouchableOpacity>
            <TouchableOpacity style={styles.feedbackButton} onPress={onComment}>
                <MaterialCommunityIcons name="comment-text-outline" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.feedbackButton} onPress={onSave}>
                <MaterialCommunityIcons name="playlist-plus" size={24} color="white" />
            </TouchableOpacity>
        </View>

        <View style={styles.progressContainer}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={progress.duration}
            value={progress.position}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#A9A9A9"
            thumbTintColor="#FFFFFF"
          />
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{new Date(progress.position * 1000).toISOString().substr(14, 5)}</Text>
            <Text style={styles.timeText}>{new Date(progress.duration * 1000).toISOString().substr(14, 5)}</Text>
          </View>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity onPress={onShuffle}>
            <MaterialCommunityIcons name="shuffle-variant" size={32} color={isShuffleEnabled ? '#1DB954' : 'white'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onSkipPrevious}>
            <Ionicons name="play-skip-back" size={48} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onPlayPause} style={styles.playButton}>
            <Ionicons name={progress.isPlaying ? 'pause' : 'play'} size={64} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onSkipNext}>
            <Ionicons name="play-skip-forward" size={48} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onRepeat}>
            {renderRepeatIcon()}
          </TouchableOpacity>
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity style={styles.tab} onPress={() => onTabChange('Up Next')}>
            <Text style={[styles.tabText, activeTab === 'Up Next' && styles.activeTabText]}>UP NEXT</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab} onPress={() => onTabChange('Lyrics')}>
            <Text style={[styles.tabText, activeTab === 'Lyrics' && styles.activeTabText]}>LYRICS</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab} onPress={() => onTabChange('Related')}>
            <Text style={[styles.tabText, activeTab === 'Related' && styles.activeTabText]}>RELATED</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    position: 'absolute',
    top: 90
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  activeToggle: {
    backgroundColor: 'white',
  },
  toggleText: {
    color: 'white',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  video: {
      width: '100%',
      height: 300,
  },
  albumArt: {
    width: 300,
    height: 300,
    borderRadius: 10,
  },
  songDetails: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  artist: {
    fontSize: 18,
    color: '#A9A9A9',
    marginTop: 5,
    textAlign: 'center',
  },
  bottomContainer: {
      width: '100%',
      paddingHorizontal: 20,
      paddingBottom: 20
  },
  feedbackContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 15,
  },
  feedbackButton: {
    alignItems: 'center',
  },
  feedbackCount: {
    color: 'white',
    fontSize: 12,
  },
  progressContainer: {
    width: '100%',
    marginVertical: 15,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  timeText: {
    color: '#A9A9A9',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    marginVertical: 15,
  },
  playButton: {
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 10,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 10,
  },
  tab: {
    paddingBottom: 10,
  },
  tabText: {
    color: '#A9A9A9',
    fontSize: 16,
  },
  activeTabText: {
    color: 'white',
  },
  tabView: {
      flex: 1,
      width: '100%',
  },
  tabContentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  tabContentText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 20
  },
  queueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  queueAlbumArt: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  queueSongInfo: {
    flex: 1,
    marginLeft: 10,
  },
  queueSongTitle: {
    color: 'white',
    fontSize: 16,
  },
  queueArtistName: {
    color: '#A9A9A9',
    fontSize: 14,
  },
});

export default FullScreenPlayer;
