import { Capacitor } from "@capacitor/core";
import type { IAuthService } from "./auth-interface";
import { FirebaseWebAuthService } from "./auth-web";
import { FirebaseAppAuthService } from "./auth-app";

// เช็ค Platform: ถ้าเป็น Native (Android/iOS) ใช้ Class App, ถ้าไม่ใช่ใช้ Class Web
export const authService: IAuthService = Capacitor.isNativePlatform()
  ? new FirebaseAppAuthService()
  : new FirebaseWebAuthService();