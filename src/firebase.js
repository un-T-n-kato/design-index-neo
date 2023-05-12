// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEwnHmdNQzQTXRV7CqcwHuyIpplNjqCRg",
  authDomain: "design-index-neo.firebaseapp.com",
  projectId: "design-index-neo",
  storageBucket: "design-index-neo.appspot.com",
  messagingSenderId: "65632822547",
  appId: "1:65632822547:web:37755dddfd94e8f7f866e6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);

export default storage;