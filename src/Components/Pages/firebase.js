import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCBEKh7_225T3XIXlDMWZrfGHjS7pg9H7c",
    authDomain: "cvss-369e5.firebaseapp.com",
    projectId: "cvss-369e5",
    storageBucket: "cvss-369e5.appspot.com",
    messagingSenderId: "1039955644453",
    appId: "1:1039955644453:web:194212838fd11577c26fcc",
    measurementId: "G-DBELCC3ZPJ"
  };

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

export { db };
