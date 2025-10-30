
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBFS6a7BONeqJbXr6bwGQlVrndlGtGVyKA",
  authDomain: "spoton-music-player-5590-1bfad.firebaseapp.com",
  projectId: "spoton-music-player-5590-1bfad",
  storageBucket: "spoton-music-player-5590-1bfad.firebasestorage.app",
  messagingSenderId: "527038542967",
  appId: "1:527038542967:web:a15a5525e589ea7fe5c272"
};

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
}

const auth = getAuth(app);

export { auth };
