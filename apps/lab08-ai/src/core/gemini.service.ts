import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import type { Base64Image, ImageAnalysisResult } from "./ai.interface";


const API_KEY = "AIzaSyAY0_d7nswaosa7yt9VA2aYuPzM-14U1JE"; 

const genAI = new GoogleGenerativeAI(API_KEY);



const schema = {
  type: SchemaType.OBJECT,
  properties: {
    caption: { type: SchemaType.STRING },
    tags: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },
    objects: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          name: { type: SchemaType.STRING },
          confidence: { type: SchemaType.NUMBER },
        },
      },
    },
    safety: {
      type: SchemaType.OBJECT,
      properties: {
        isSensitive: { type: SchemaType.BOOLEAN },
        notes: { type: SchemaType.STRING },
      },
    },
  },
  required: ["caption", "tags"],
};

// 3. ตั้งค่า Model
const model = genAI.getGenerativeModel({
model: "gemini-2.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: schema as any,
  },
});

export class GeminiVisionService {
  static async analyze(image: Base64Image): Promise<ImageAnalysisResult> {
    const prompt = "วิเคราะห์ภาพนี้และตอบกลับเป็น JSON ตาม schema: caption (ไทย), tags, objects";

    // จัดรูปแบบข้อมูลภาพให้ตรงกับ SDK นี้
    const imagePart = {
      inlineData: {
        data: image.base64,
        mimeType: image.mimeType,
      },
    };

    try {
      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();
      
      if (!text) return {} as ImageAnalysisResult;
      return JSON.parse(text) as ImageAnalysisResult;
    } catch (error) {
      console.error("Gemini Error:", error);
      alert("เกิดข้อผิดพลาด: เช็ค API Key หรือ Internet");
      throw error;
    }
  }
}