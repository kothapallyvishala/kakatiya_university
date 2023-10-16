import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB1Ol3MP0Skt5fyeNvwfKPXy6KDDXgURrc",
  authDomain: "kakatiya-university.firebaseapp.com",
  projectId: "kakatiya-university",
  storageBucket: "kakatiya-university.appspot.com",
  messagingSenderId: "222697709897",
  appId: "1:222697709897:web:8187fac0dd69c915eb3a98",
  measurementId: "G-KEXEMSNXTG",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const storage = getStorage();

export { app, storage };
