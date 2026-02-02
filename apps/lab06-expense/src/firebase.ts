// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// 1. 👇 ต้องเพิ่มบรรทัดนี้ เพื่อดึงฟังก์ชัน getFirestore มาใช้
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyB5Xg_sd_1sNoogMP-50eyntaunGcCTtDY",
  authDomain: "lab06-ionic-firebase.firebaseapp.com",
  projectId: "lab06-ionic-firebase",
  storageBucket: "lab06-ionic-firebase.firebasestorage.app",
  messagingSenderId: "69753187119",
  appId: "1:69753187119:web:8070518e950a7964c68fda",
  measurementId: "G-NMSXXLL0YX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// 2. 👇 ต้องเติม export ข้างหน้า เพื่อให้ไฟล์ AddExpense.tsx มองเห็นตัวแปรนี้
export const db = getFirestore(app);