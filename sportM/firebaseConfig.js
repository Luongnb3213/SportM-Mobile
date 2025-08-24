// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAFRzS7Jas1jMzWsGDrTmG6TpLy60bMwsQ",
  authDomain: "sportm-eb72c.firebaseapp.com",
  projectId: "sportm-eb72c",
  storageBucket: "sportm-eb72c.firebasestorage.app",
  messagingSenderId: "1013531353218",
  appId: "1:1013531353218:web:01539d8ac6560c0852949b",
  measurementId: "G-48S11C3WR7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
