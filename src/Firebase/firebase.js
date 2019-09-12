import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCcX8W1qdsD_EAfZ-l4x_FnrhIDPHBYBAw",
  authDomain: "firechat-bfe58.firebaseapp.com",
  databaseURL: "https://firechat-bfe58.firebaseio.com",
  projectId: "firechat-bfe58",
  storageBucket: "",
  messagingSenderId: "535484116295",
  appId: "1:535484116295:web:c43bf4b9a31a76ffe27062"
};
class Firebase {
    constructor() {
        app.initializeApp(firebaseConfig);
        this.auth = app.auth();
        this.database = app.database();
    }

    createUserWithEmailAndPassword = (email, password) =>
        this.auth.createUserWithEmailAndPassword(email,password);

    signInWithEmailAndPassword = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password);

    signOut = () =>
        this.auth.signOut();

    user = (uid) =>
        this.database.ref(`users/${uid}`);

    users = () =>
        this.database.ref('users');

    channels = () =>
        this.database.ref('channels');
    channel = (cid) =>
        this.database.ref(`channels/${cid}`);
}

export default Firebase;
