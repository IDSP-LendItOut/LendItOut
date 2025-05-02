// // Import the functions you need from the SDKs you need
// import { getAnalytics } from "firebase/analytics";
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: process.env.FIREBASE_API_KEY,
//   authDomain: "lend-it-out.firebaseapp.com",
//   projectId: "lend-it-out",
//   storageBucket: "lend-it-out.firebasestorage.app",
//   messagingSenderId: "183249547580",
//   appId: "1:183249547580:web:aaf91ebcbc18901ff8ae39",
//   measurementId: "G-4RCPE7DJK9",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// export {}

// public/scripts/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "lend-it-out.firebaseapp.com",
  projectId: "lend-it-out",
  storageBucket: "lend-it-out.firebasestorage.app",
  messagingSenderId: "183249547580",
  appId: "1:183249547580:web:aaf91ebcbc18901ff8ae39",
  measurementId: "G-4RCPE7DJK9",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Export for use elsewhere
export { auth, RecaptchaVerifier, signInWithPhoneNumber };
