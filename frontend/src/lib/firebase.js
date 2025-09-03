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

// Referencia a la colección Sedoanalgesicos
const sedoanalgesicosCollection = collection(db, 'Sedoanalgesicos');

// Funciones para interactuar con la colección Sedoanalgesicos
export const getSedoanalgesicos = async () => {
  const snapshot = await getDocs(sedoanalgesicosCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addSedoanalgesico = async (data) => {
  return await addDoc(sedoanalgesicosCollection, data);
};

export const updateSedoanalgesico = async (id, data) => {
  const docRef = doc(db, 'Sedoanalgesicos', id);
  return await updateDoc(docRef, data);
};

export const deleteSedoanalgesico = async (id) => {
  const docRef = doc(db, 'Sedoanalgesicos', id);
  return await deleteDoc(docRef);
};

export { db };
