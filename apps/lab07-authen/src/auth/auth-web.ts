import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithPhoneNumber, 
  RecaptchaVerifier,
  ConfirmationResult 
} from "firebase/auth";
import type { AuthUser, IAuthService, EmailPasswordCredentials, PhoneCredentials } from "./auth-interface";


const firebaseConfig = {
  apiKey: "AIzaSyB5Xg_sd_1sNoogMP-50eyntaunGcCTtDY",
  authDomain: "lab06-ionic-firebase.firebaseapp.com",
  projectId: "lab06-ionic-firebase",
  storageBucket: "lab06-ionic-firebase.firebasestorage.app",
  messagingSenderId: "69753187119",
  appId: "1:69753187119:web:8070518e950a7964c68fda",
  measurementId: "G-NMSXXLL0YX"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);


function mapUser(u: any): AuthUser {
  return {
    uid: u.uid,
    email: u.email,
    displayName: u.displayName,
    photoUrl: u.photoURL,
  };
}

// --- ส่วนที่ 2: จัดการ reCAPTCHA (จำเป็นสำหรับ Phone Login บนเว็บ) ---
let verifier: RecaptchaVerifier | null = null;
let confirmationResult: ConfirmationResult | null = null;
const recaptchaContainerId = "recaptcha-container"; // ต้องมี div id นี้ในหน้า Login

export function getRecaptchaVerifier(containerId: string): RecaptchaVerifier {
  if (!verifier) {
    verifier = new RecaptchaVerifier(firebaseAuth, containerId, {
      size: "invisible", 
    });
  }
  return verifier;
}


export class FirebaseWebAuthService implements IAuthService {
  
  async getCurrentUser(): Promise<AuthUser | null> {
    await firebaseAuth.authStateReady();
    return firebaseAuth.currentUser ? mapUser(firebaseAuth.currentUser) : null;
  }

  async loginWithEmailPassword(creds: EmailPasswordCredentials): Promise<AuthUser> {
    const r = await signInWithEmailAndPassword(firebaseAuth, creds.email, creds.password);
    return mapUser(r.user);
  }

  async loginWithGoogle(): Promise<AuthUser> {
    const provider = new GoogleAuthProvider();
    // บนเว็บใช้ Popup เด้งขึ้นมา
    const r = await signInWithPopup(firebaseAuth, provider);
    return mapUser(r.user);
  }

  async logout(): Promise<void> {
    await firebaseAuth.signOut();
  }

  // Phone Login บนเว็บ
  async startPhoneLogin(creds: PhoneCredentials): Promise<{ verificationId: string }> {
    const verifier = getRecaptchaVerifier(recaptchaContainerId);
    
    // ส่ง OTP
    confirmationResult = await signInWithPhoneNumber(
      firebaseAuth,
      creds.phoneNumberE164,
      verifier
    );
    
    // Web SDK จะจัดการ verificationId ภายใน confirmationResult ให้เอง
    return { verificationId: confirmationResult.verificationId };
  }

  async confirmPhoneCode(payload: { verificationId: string; verificationCode: string }): Promise<AuthUser> {
    if (!confirmationResult) {
      throw new Error("No confirmation result");
    }
    const r = await confirmationResult.confirm(payload.verificationCode);
    return mapUser(r.user);
  }
}