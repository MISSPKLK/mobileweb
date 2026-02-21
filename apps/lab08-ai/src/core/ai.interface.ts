// src/core/ai.interface.ts

export interface Base64Image {
  base64: string;
  mimeType: string;
}

export interface ImageAnalysisResult {
  caption: string;
  tags: string[];
  objects?: Array<{ name: string; confidence?: number }>;
  safety?: { isSensitive: boolean; notes?: string };
}

// กำหนด Schema แบบ JSON ธรรมดา (ใช้กับ Firebase รุ่นใหม่ได้เลย)
export const imageAnalysisSchema = {
  type: "OBJECT",
  properties: {
    caption: { type: "STRING" },
    tags: {
      type: "ARRAY",
      items: { type: "STRING" },
    },
    objects: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          name: { type: "STRING" },
          confidence: { type: "NUMBER" },
        },
      },
    },
    safety: {
      type: "OBJECT",
      properties: {
        isSensitive: { type: "BOOLEAN" },
        notes: { type: "STRING" },
      },
    },
  },
  // บังคับว่าต้องตอบ 2 ค่านี้เสมอ
  required: ["caption", "tags"],
};