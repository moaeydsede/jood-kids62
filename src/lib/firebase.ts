import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBWWJ7NQTQlX4jniHzReR12NfdA-Nu5aos",
  authDomain: "joodkids-2c94b.firebaseapp.com",
  projectId: "joodkids-2c94b",
  storageBucket: "joodkids-2c94b.firebasestorage.app",
  messagingSenderId: "834966570815",
  appId: "1:834966570815:web:49f91287efec295fac758a",
};

export const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
