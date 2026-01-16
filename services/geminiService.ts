
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { LabReport, LabStatus } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const LAB_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING, description: "A high-level human-friendly summary of the report." },
    results: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          testName: { type: Type.STRING },
          value: { type: Type.STRING },
          unit: { type: Type.STRING },
          referenceRange: { type: Type.STRING },
          status: { type: Type.STRING, enum: ["Normal", "Abnormal", "Critical", "Unknown"] },
          explanation: { type: Type.STRING, description: "Simple explanation of what this test measures." }
        },
        required: ["testName", "value", "status"]
      }
    },
    disclaimer: { type: Type.STRING, description: "A medical safety disclaimer." }
  },
  required: ["summary", "results", "disclaimer"]
};

export async function analyzeLabReport(fileBase64: string, mimeType: string): Promise<Partial<LabReport>> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      {
        parts: [
          { inlineData: { data: fileBase64, mimeType } },
          { text: "Extract the lab test data from this report. Provide a clear summary and detailed table of results. Ensure the language is patient-friendly but accurate. Mark results outside reference ranges as Abnormal." }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: LAB_SCHEMA,
    }
  });

  if (!response.text) throw new Error("No response from AI");
  return JSON.parse(response.text);
}

export async function generateVeoVideo(imageParams: { data: string, mimeType: string }, prompt: string) {
  // Check for API key selection (simulated for environment)
  const operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt || 'Animate this medical report subtly with soft floating data particles',
    image: {
      imageBytes: imageParams.data,
      mimeType: imageParams.mimeType,
    },
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  });

  return operation;
}

export async function pollVideoOperation(operationId: any) {
  return await ai.operations.getVideosOperation({ operation: operationId });
}
