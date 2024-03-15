import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA8u1NNoM74QmiRM0WOSWgYvvUjxyq8xH8",
  authDomain: "belogger-mern.firebaseapp.com",
  projectId: "belogger-mern",
  storageBucket: "belogger-mern.appspot.com",
  messagingSenderId: "407040772179",
  appId: "1:407040772179:web:c68f311d9a7a5327341ea6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Google auth
const provider = new GoogleAuthProvider();
const auth = getAuth();

export const authWithGoogle = async () => {
  let user = null;
  await signInWithPopup(auth, provider)
    .then((result) => {
      user = result.user;
    })
    .catch((err) => {
      console.log(err);
    });

  return user;
};
