
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { openDrawer } from 'expo-router/drawer';

const updates = [
  {
    id: '1',
    icon: 'moon-outline',
    title: 'Dark Theme is Here!',
    date: 'July 2, 2024',
    description: 'You can now enjoy Spoton in a beautiful new dark theme. Perfect for late-night listening sessions!\n\nGo to the Settings page to switch between light and dark modes.',
    buttonText: 'Notify me about this update',
  },
  {
    id: '2',
    icon: 'rocket-outline',
    title: 'App Version 1.1 Released!',
    date: 'June 24, 2024',
    description: 'We\'re constantly working to improve your Spoton experience. Here are the latest features and bug fixes:',
    changes: [
      'AI Recommendations: Get personalized song suggestions based on your listening',
    ],
  },
];

const WhatsNewScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.menuButton} onPress={openDrawer}>
        <Ionicons name="menu" size={32} color="white" />
      </TouchableOpacity>
      <Text style={styles.mainTitle}>What's New</Text>

      {updates.map((update) => (
        <View key={update.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name={update.icon as any} size={24} color="white" />
            <Text style={styles.cardTitle}>{update.title}</Text>
          </View>
          <Text style={styles.cardDate}>{update.date}</Text>
          <Text style={styles.cardDescription}>{update.description}</Text>
          {update.changes && (
            <View style={styles.changesContainer}>
              {update.changes.map((change, i) => (
                <View key={i} style={styles.changeItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.changeText}>{change}</Text>
                </View>
              ))}
            </View>
          )}
          {update.buttonText && (
            <TouchableOpacity style={styles.notifyButton}>
              <MaterialCommunityIcons name="flare" size={20} color="white" style={{ marginRight: 5 }} />
              <Text style={styles.notifyButtonText}>{update.buttonText}</Text>
            </TouchableOpacity>
          )}
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
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 8,
    padding: 24,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  cardDate: {
    color: '#A9A9A9',
    fontSize: 14,
    marginBottom: 16,
  },
  cardDescription: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
  },
  changesContainer: {
    marginTop: 16,
  },
  changeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet: {
    color: '#fff',
    marginRight: 10,
    fontSize: 16,
    lineHeight: 24,
  },
  changeText: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
    lineHeight: 24,
  },
  notifyButton: {
    backgroundColor: '#A78BFA',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    alignSelf: 'flex-start',
  },
  notifyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default WhatsNewScreen;
