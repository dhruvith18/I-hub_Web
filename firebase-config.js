import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDaKh_-UjLqdm-MP823Hy_14U1VfeYZCUs",
  authDomain: "i-hub-web.firebaseapp.com",
  projectId: "i-hub-web",
  storageBucket: "i-hub-web.firebasestorage.app",
  messagingSenderId: "191118586086",
  appId: "1:191118586086:web:bd74395af7f3d338b08b27",
  measurementId: "G-04MW1XFPHD"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };