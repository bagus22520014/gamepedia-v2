import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCGtQgGFQcwBXEy4GhFqhrMIxW1l3m2csQ",
  authDomain: "gamepedia-2d934.firebaseapp.com",
  projectId: "gamepedia-2d934",
  storageBucket: "gamepedia-2d934.appspot.com",
  messagingSenderId: "79814456311",
  appId: "1:79814456311:web:3f19005667f4acb0fc34f2",
  measurementId: "G-F6HJGVLGKH"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
