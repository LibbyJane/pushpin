import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyDGyTe9DyvtL9ySTTq8XAsuojtQ2imey2A",
    authDomain: "thedojo-d76cf.firebaseapp.com",
    projectId: "thedojo-d76cf",
    storageBucket: "thedojo-d76cf.appspot.com",
    messagingSenderId: "475667142609",
    appId: "1:475667142609:web:fe8ab1d0c5fc6bc080b2f0"
};

firebase.initializeApp(firebaseConfig)
const projectFirestore = firebase.firestore()
const projectAuth = firebase.auth()
const projectStorage = firebase.storage()

const timestamp = firebase.firestore.Timestamp

export { projectFirestore, projectAuth, projectStorage, timestamp }

