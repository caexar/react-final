import app from "firebase/app"
import "firebase/firestore"
import "firebase/auth"


const firebaseConfig = {
  apiKey: "AIzaSyCtYt-DJp61RFBPc42SzvxGugCFu2oW8wU",
  authDomain: "apartadoreact.firebaseapp.com",
  projectId: "apartadoreact",
  storageBucket: "apartadoreact.appspot.com",
  messagingSenderId: "951296701865",
  appId: "1:951296701865:web:cd790e6fc940c44454c0b8"
};

// Initialize Firebase
app.initializeApp(firebaseConfig);
const db=app.firestore();
const auth=app.auth();
export {db,auth};