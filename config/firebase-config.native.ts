
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyB1-A8h_1O4y5J1s3vX8s6k9fQ_Zl2Yy7c",
  projectId: "spoton-music-player-34277",
  storageBucket: "spoton-music-player-34277.appspot.com",
  appId: "1:535849959925:android:bbf13596c52a36d5671a5c",
};

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { auth };
