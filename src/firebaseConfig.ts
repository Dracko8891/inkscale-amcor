import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Substitua pelos valores do seu projeto Firebase Console
// https://console.firebase.google.com/
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDummyKeyForDevOnlyReplaceMe',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'inkscale-amcor.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'inkscale-amcor',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'inkscale-amcor.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:000000000000:web:abcdef123456',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const microsoftProvider = new OAuthProvider('microsoft.com');
microsoftProvider.setCustomParameters({
  tenant: import.meta.env.VITE_MICROSOFT_TENANT_ID || 'common',
  prompt: 'select_account',
});

export default app;
