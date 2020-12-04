// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: 'AIzaSyBAfoTxoTpmBd50BBROT9kjoW-9pvdWPz0',
    authDomain: 'instagramclone-15ecc.firebaseapp.com',
    databaseURL: 'https://instagramclone-15ecc-default-rtdb.firebaseio.com',
    projectId: 'instagramclone-15ecc',
    storageBucket: 'instagramclone-15ecc.appspot.com',
    messagingSenderId: '249052422312',
    appId: '1:249052422312:web:f912b5d395c6eb5bf5229d',
    measurementId: 'G-5CQY4QVXXL',
});

const db = firebaseApp.firestore();

const auth = firebase.auth();

const storage = firebase.storage();

export { db, auth, storage };
