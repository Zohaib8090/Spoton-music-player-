
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  SafeAreaView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const CommentItem = ({ comment }) => (
  <View style={styles.commentContainer}>
    <Image source={{ uri: comment.author.avatar }} style={styles.avatar} />
    <View style={styles.commentContent}>
      <View style={styles.commentHeader}>
        <Text style={styles.authorName}>{comment.author.name}</Text>
        <Text style={styles.commentDate}>{comment.date}</Text>
      </View>
      <Text style={styles.commentText}>{comment.text}</Text>
      <View style={styles.commentActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="thumbs-up-outline" size={18} color="white" />
          <Text style={styles.actionCount}>{comment.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="thumbs-down-outline" size={18} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <MaterialCommunityIcons name="comment-text-outline" size={18} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const Comments = ({
  song,
  isVisible,
  onClose,
  onPlayPause,
  onSkipNext,
  onSkipPrevious,
  isPlaying,
  onCast,
  comments,
  onCommentSubmit,
}) => {
  const [newComment, setNewComment] = useState('');

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      onCommentSubmit(newComment.trim());
      setNewComment('');
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <Image source={{ uri: song?.artwork }} style={styles.albumArt} />
            <View style={styles.songInfo}>
                <Text style={styles.songTitle}>{song?.title}</Text>
                <Text style={styles.artistName}>{song?.artist}</Text>
            </View>
            <View style={styles.controls}>
                <TouchableOpacity onPress={onCast}>
                    <Ionicons name="cast" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={onSkipPrevious}>
                    <Ionicons name="play-skip-back" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={onPlayPause}>
                    <Ionicons name={isPlaying ? 'pause' : 'play'} size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={onSkipNext}>
                    <Ionicons name="play-skip-forward" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </View>

        <View style={styles.commentsHeader}>
          <Text style={styles.commentsTitle}>Comments</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.commentTabs}>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.activeTabText}>Top</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>Newest</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={comments}
          renderItem={({ item }) => <CommentItem comment={item} />}
          keyExtractor={(item, index) => index.toString()}
          style={styles.commentsList}
        />

        <View style={styles.commentInputContainer}>
          <Image source={{ uri: 'https://via.placeholder.com/40' }} style={styles.userAvatar} />
          <TextInput
            style={styles.commentInput}
            placeholder="Reminds me of..."
            placeholderTextColor="#A9A9A9"
            value={newComment}
            onChangeText={setNewComment}
            onSubmitEditing={handleCommentSubmit}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#121212',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      backgroundColor: '#2C2C2E',
    },
    albumArt: {
      width: 50,
      height: 50,
      borderRadius: 5,
    },
    songInfo: {
      flex: 1,
      marginLeft: 10,
    },
    songTitle: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    artistName: {
      color: '#A9A9A9',
      fontSize: 14,
    },
    controls: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: 150,
    },
    commentsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 15,
    },
    commentsTitle: {
      color: 'white',
      fontSize: 20,
      fontWeight: 'bold',
    },
    commentTabs: {
      flexDirection: 'row',
      paddingHorizontal: 15,
      marginBottom: 10,
    },
    tab: {
      marginRight: 20,
    },
    tabText: {
      color: '#A9A9A9',
      fontSize: 16,
    },
    activeTabText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    commentsList: {
      flex: 1,
    },
    commentContainer: {
      flexDirection: 'row',
      padding: 15,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
    },
    commentContent: {
      flex: 1,
      marginLeft: 10,
    },
    commentHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
authorName: {
    color: 'white',
    fontWeight: 'bold',
    marginRight: 5,
},
commentDate: {
    color: '#A9A9A9',
    fontSize: 12,
},
commentText: {
    color: 'white',
    marginTop: 5,
},
commentActions: {
    flexDirection: 'row',
    marginTop: 10,
},
actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
},
actionCount: {
    color: 'white',
    marginLeft: 5,
},
commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#2C2C2E',
},
userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
},
commentInput: {
    flex: 1,
    backgroundColor: '#2C2C2E',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: 'white',
    marginLeft: 10,
},
});

export default Comments;
