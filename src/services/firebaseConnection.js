import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDdxpW8vR-dAdFC1YkF3T70Q8fUKoZWGQA',
  authDomain: 'sistema-f7710.firebaseapp.com',
  projectId: 'sistema-f7710',
  storageBucket: 'sistema-f7710.appspot.com',
  messagingSenderId: '517981854867',
  appId: '1:517981854867:web:a2672146ea7514dbb78166',
  measurementId: 'G-YFDE11ZQZB',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
