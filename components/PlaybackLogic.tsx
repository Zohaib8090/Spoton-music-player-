
import { useEffect, useRef, useState } from 'react';
import Video from 'react-native-video';
import { usePlaybackSettings } from '@/context/PlaybackSettingsContext';
import MiniPlayer from './MiniPlayer';
import FullScreenPlayer from './FullScreenPlayer';
import Comments from './Comments';
import { YOUTUBE_API_KEY } from '../config/streaming-services';

const PlaybackLogic = () => {
  const { automix, crossfade, gaplessPlayback } = usePlaybackSettings();
  const [progress, setProgress] = useState({ currentTime: 0, seekableDuration: 0 });
  const isFading = useRef(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isCommentsVisible, setIsCommentsVisible] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off');
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
  const videoRef = useRef(null);


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
        setIsPlaying(!isPlaying);
    };

    const handleSkipNext = () => {
        const currentIndex = queue.findIndex(track => track.id === currentTrack.id);
        const nextIndex = (currentIndex + 1) % queue.length;
        setCurrentTrack(queue[nextIndex]);
    };

    const handleSkipPrevious = () => {
        const currentIndex = queue.findIndex(track => track.id === currentTrack.id);
        const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
        setCurrentTrack(queue[prevIndex]);
    };

    const handleSeek = (value) => {
        videoRef.current.seek(value);
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
    if (!isShuffleEnabled) {
        const shuffledQueue = [...queue].sort(() => Math.random() - 0.5);
        setQueue(shuffledQueue);
    } else {
        // How to un-shuffle is a design decision. For now, we will just reset to the original queue.
        // This requires storing the original queue separately.
    }
    setIsShuffleEnabled(!isShuffleEnabled);
  };

  const handleRepeat = () => {
    const repeatModes = ['off', 'track', 'queue'];
    const currentModeIndex = repeatModes.indexOf(repeatMode);
    const newRepeatMode = repeatModes[(currentModeIndex + 1) % repeatModes.length];
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
      {currentTrack && (
        <Video
          ref={videoRef}
          source={{ uri: currentTrack.url }}
          paused={!isPlaying}
          onProgress={data => setProgress({ currentTime: data.currentTime, seekableDuration: data.seekableDuration })}
          onEnd={handleSkipNext}
          repeat={repeatMode === 'track'}
        />
      )}
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
        progress={progress}
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
        isPlaying={isPlaying}
        onSeek={handleSeek}
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
