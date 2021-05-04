import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyBT16pEd2NFF7WsfcPYhhj6yFO1JV45hsA",
  authDomain: "instagram-clone-8fac0.firebaseapp.com",
  projectId: "instagram-clone-8fac0",
  storageBucket: "instagram-clone-8fac0.appspot.com",
  messagingSenderId: "765823057753",
  appId: "1:765823057753:web:568cc47315c33c09b3d648",
  measurementId: "G-EMQ1KV5BYS",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
