// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: 'AIzaSyC6V1bYCq2N2tCYVsVfJLUb1DDBIkTp3_0',
  authDomain: 'sport-cf3bb.firebaseapp.com',
  projectId: 'sport-cf3bb',
  storageBucket: 'sport-cf3bb.firebasestorage.app',
  messagingSenderId: '541367103107',
  appId: '1:541367103107:web:da3a17ce4b8569b62475b6',
  measurementId: 'G-78W5XBHY2M',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
