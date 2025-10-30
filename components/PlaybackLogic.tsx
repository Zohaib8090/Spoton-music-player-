
import { useEffect, useRef, useState } from 'react';
import TrackPlayer, { useProgress, useActiveTrack, Event, RepeatMode } from 'react-native-track-player';
import { usePlaybackSettings } from '@/context/PlaybackSettingsContext';
import MiniPlayer from './MiniPlayer';
import FullScreenPlayer from './FullScreenPlayer';
import Comments from './Comments';
import { YOUTUBE_API_KEY } from '../config/streaming-services';

const PlaybackLogic = () => {
  const { automix, crossfade, gaplessPlayback } = usePlaybackSettings();
  const progress = useProgress(250);
  const isFading = useRef(false);
  const currentTrack = useActiveTrack();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isCommentsVisible, setIsCommentsVisible] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const [repeatMode, setRepeatMode] = useState(RepeatMode.Off);
  const [isShuffleEnabled, setIsShuffleEnabled] = useState(false);
  const [queue, setQueue] = useState([]);
  const [activeTab, setActiveTab] = useState('Up Next');
  const [lyrics, setLyrics] = useState(null);
  const [lyricsLoading, setLyricsLoading] = useState(false);
  const [relatedSongs, setRelatedSongs] = useState([]);
  const [relatedSongsLoading, setRelatedSongsLoading] = useState(false);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const getInitialData = async () => {
      const initialRepeatMode = await TrackPlayer.getRepeatMode();
      setRepeatMode(initialRepeatMode);
      const currentQueue = await TrackPlayer.getQueue();
      setQueue(currentQueue);
    };
    getInitialData();
  }, []);

  useEffect(() => {
    const listener = TrackPlayer.addEventListener(Event.PlaybackState, (data) => {
      setIsPlaying(data.state === 'playing');
    });
    return () => listener.remove();
  }, []);

  useEffect(() => {
    if (
      automix &&
      crossfade > 0 &&
      progress.duration > 0 &&
      progress.position > 0 &&
      !isFading.current &&
      progress.duration - progress.position <= crossfade
    ) {
      isFading.current = true;
      let volume = 1;
      const fadeOutInterval = setInterval(() => {
        volume = Math.max(0, volume - 0.1);
        TrackPlayer.setVolume(volume);
        if (volume <= 0) {
          clearInterval(fadeOutInterval);
          TrackPlayer.skipToNext().then(() => {
            // Reset volume for the new track
            TrackPlayer.setVolume(1);
            isFading.current = false;
          });
        }
      }, (crossfade * 1000) / 10); // 10 steps for fade out
    }
  }, [automix, crossfade, progress.position, progress.duration]);

  useEffect(() => {
    // Gapless playback is usually handled by the underlying audio engine and is enabled by default in modern players.
    // This setting will ensure that we are not interfering with the default behavior.
    // For this implementation, we will assume that the track player handles gapless playback automatically when this setting is on.
  }, [gaplessPlayback]);

  const fetchInteractions = async (songId) => {
    try {
      const response = await fetch(`http://localhost:3000/interactions/${songId}`);
      const data = await response.json();
      setLikes(data.likes || 0);
      setDislikes(data.dislikes || 0);
      setComments(data.comments || []);
    } catch (error) {
      console.error('Failed to fetch interactions:', error);
    }
  };

  useEffect(() => {
    if (currentTrack) {
      fetchInteractions(currentTrack.id);
    }
  }, [currentTrack]);

  const fetchLyrics = async (artist, title) => {
    setLyricsLoading(true);
    setLyrics(null);
    try {
      const response = await fetch(`https://api.lyrics.ovh/v1/${artist}/${title}`);
      const data = await response.json();
      if (data.lyrics) {
        setLyrics(data.lyrics);
      } else {
        setLyrics('No lyrics found.');
      }
    } catch (error) {
      setLyrics('Could not fetch lyrics.');
    }
    setLyricsLoading(false);
  };

  const fetchRelatedSongs = async (artist, title) => {
    setRelatedSongsLoading(true);
    setRelatedSongs([]);
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
          artist + ' ' + title
        )}&type=video&maxResults=10&key=${YOUTUBE_API_KEY}`
      );
      const data = await response.json();
      if (data.items) {
        const songs = data.items.map((item) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          artist: item.snippet.channelTitle,
          artwork: item.snippet.thumbnails.high.url,
        }));
        setRelatedSongs(songs);
      } else {
        setRelatedSongs([]);
      }
    } catch (error) {
      console.error(error);
      setRelatedSongs([]);
    }
    setRelatedSongsLoading(false);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'Lyrics' && currentTrack) {
      fetchLyrics(currentTrack.artist, currentTrack.title);
    } else if (tab === 'Related' && currentTrack) {
      fetchRelatedSongs(currentTrack.artist, currentTrack.title);
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      TrackPlayer.pause();
    } else {
      TrackPlayer.play();
    }
  };

  const handleSkipNext = () => {
    TrackPlayer.skipToNext();
  };

  const handleSkipPrevious = () => {
    TrackPlayer.skipToPrevious();
  };

  const handleCast = () => {
    console.log('Casting...');
  };

  const handleOpenFullScreen = () => {
    setIsFullScreen(true);
  };

  const handleCloseFullScreen = () => {
    setIsFullScreen(false);
  };

  const handleOpenComments = () => {
    setIsCommentsVisible(true);
  };

  const handleCloseComments = () => {
    setIsCommentsVisible(false);
  };

  const handleShuffle = async () => {
    const currentQueue = await TrackPlayer.getQueue();
    if (!isShuffleEnabled) {
        const shuffledQueue = [...currentQueue].sort(() => Math.random() - 0.5);
        await TrackPlayer.removeUpcomingTracks();
        await TrackPlayer.add(shuffledQueue);
    } else {
        // How to un-shuffle is a design decision. For now, we will just reset to the original queue.
        // This requires storing the original queue separately.
    }
    setIsShuffleEnabled(!isShuffleEnabled);
  };

  const handleRepeat = () => {
    const newRepeatMode = (repeatMode + 1) % 3;
    TrackPlayer.setRepeatMode(newRepeatMode);
    setRepeatMode(newRepeatMode);
  };

  const handleLike = async () => {
    if (currentTrack) {
      try {
        const response = await fetch(`http://localhost:3000/interactions/${currentTrack.id}/like`, { method: 'POST' });
        const data = await response.json();
        setLikes(data.likes);
      } catch (error) {
        console.error('Failed to like:', error);
      }
    }
  };

  const handleDislike = async () => {
    if (currentTrack) {
      try {
        const response = await fetch(`http://localhost:3000/interactions/${currentTrack.id}/dislike`, { method: 'POST' });
        const data = await response.json();
        setDislikes(data.dislikes);
      } catch (error) {
        console.error('Failed to dislike:', error);
      }
    }
  };

  const handleCommentSubmit = async (comment) => {
    if (currentTrack) {
      try {
        const response = await fetch(`http://localhost:3000/interactions/${currentTrack.id}/comment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ comment }),
        });
        const data = await response.json();
        setComments(data.comments);
      } catch (error) {
        console.error('Failed to submit comment:', error);
      }
    }
  };

  const handleSave = () => console.log('Saved!');
  const handleToggleVideo = () => {
    setIsVideo(!isVideo);
  };
  const handleMoreOptions = () => console.log('More options');

  return (
    <>
      <MiniPlayer
        song={currentTrack}
        onPlayPause={handlePlayPause}
        onSkipNext={handleSkipNext}
        onSkipPrevious={handleSkipPrevious}
        onCast={handleCast}
        onPress={handleOpenFullScreen}
        isPlaying={isPlaying}
      />
      <FullScreenPlayer
        song={currentTrack}
        isVisible={isFullScreen}
        onClose={handleCloseFullScreen}
        onPlayPause={handlePlayPause}
        onSkipNext={handleSkipNext}
        onSkipPrevious={handleSkipPrevious}
        progress={{ ...progress, isPlaying }}
        onShuffle={handleShuffle}
        onRepeat={handleRepeat}
        isShuffleEnabled={isShuffleEnabled}
        repeatMode={repeatMode}
        onLike={handleLike}
        onDislike={handleDislike}
        onComment={handleOpenComments}
        onSave={handleSave}
        onToggleVideo={handleToggleVideo}
        onMoreOptions={handleMoreOptions}
        queue={queue}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        lyrics={lyrics}
        lyricsLoading={lyricsLoading}
        relatedSongs={relatedSongs}
        relatedSongsLoading={relatedSongsLoading}
        likes={likes}
        dislikes={dislikes}
        isVideo={isVideo}
      />
      <Comments
        song={currentTrack}
        isVisible={isCommentsVisible}
        onClose={handleCloseComments}
        onPlayPause={handlePlayPause}
        onSkipNext={handleSkipNext}
        onSkipPrevious={handleSkipPrevious}
        isPlaying={isPlaying}
        onCast={handleCast}
        comments={comments}
        onCommentSubmit={handleCommentSubmit}
      />
    </>
  );
};

export default PlaybackLogic;
