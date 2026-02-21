import type { Base64Image } from "./ai.interface";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

export class PhotoService {
  // 1) กรณีเลือกไฟล์จากเครื่อง (Input File)
  static async fromFile(file: File): Promise<Base64Image> {
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const res = String(reader.result || "");
        // แยกส่วน header data:image/...;base64, ออก เอาเฉพาะเนื้อ base64
        const b64 = res.split(",")[1];
        if (!b64) return reject(new Error("Invalid base64 data"));
        resolve(b64);
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });

    return { base64, mimeType: file.type || "image/jpeg" };
  }

  // 2) กรณีถ่ายภาพหรือเลือกจาก Gallery ผ่าน Capacitor (ใช้ได้ดีบนมือถือ)
  static async fromCamera(): Promise<Base64Image> {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Base64, // ขอข้อมูลเป็น Base64 โดยตรง
      source: CameraSource.Prompt,         // ให้ User เลือกว่าจะถ่ายใหม่หรือเลือกจากอัลบั้ม
      quality: 80,                         // ลดคุณภาพลงนิดหน่อยเพื่อไม่ให้ไฟล์ใหญ่เกินไป
    });

    if (!photo.base64String) {
      throw new Error("User cancelled or no photo data");
    }

    return {
      base64: photo.base64String,
      mimeType: photo.format ? `image/${photo.format}` : "image/jpeg",
    };
  }
}