import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCTX4EfZP8jGyFZJ8eJwirf0ofRpLxELqU",
  authDomain: "kol-second-phase-testing.firebaseapp.com",
  projectId: "kol-second-phase-testing",
  storageBucket: "kol-second-phase-testing.appspot.com",
  messagingSenderId: "306187761256",
  appId: "1:306187761256:web:d51ee09379c2ef47ffaddd",
  measurementId: "G-WL8J89CDX6",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

export const db = getFirestore(app);

export default app;
