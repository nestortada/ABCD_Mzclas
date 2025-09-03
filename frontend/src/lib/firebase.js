// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCwkKQ6dW7b_I2arF_picl9lzoNm4gEDh8",
  authDomain: "farmacia-82125.firebaseapp.com",
  projectId: "farmacia-82125",
  storageBucket: "farmacia-82125.firebasestorage.app",
  messagingSenderId: "442796032363",
  appId: "1:442796032363:web:243bb06dd2b731ae2c0c2e",
  measurementId: "G-RREZQHS6DH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Referencia a la colección Sedoanalgesia
const sedoanalgesiaCollection = collection(db, 'Sedoanalgesia');

// Funciones para interactuar con la colección Sedoanalgesia
export const getSedoanalgesia = async () => {
  const snapshot = await getDocs(sedoanalgesiaCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addSedoanalgesia = async (data) => {
  return await addDoc(sedoanalgesiaCollection, data);
};

export const updateSedoanalgesia = async (id, data) => {
  const docRef = doc(db, 'Sedoanalgesia', id);
  return await updateDoc(docRef, data);
};

export const deleteSedoanalgesia = async (id) => {
  const docRef = doc(db, 'Sedoanalgesia', id);
  return await deleteDoc(docRef);
};

export { db };
