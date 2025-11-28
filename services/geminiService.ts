import { GoogleGenAI } from "@google/genai";
import { ImageData, GenerationResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Using 'gemini-2.5-flash-image' which corresponds to the "nano banana" model as per guidelines
const MODEL_NAME = 'gemini-2.5-flash-image';

export const generateEmbraceImage = async (
  youngImage: ImageData,
  currentImage: ImageData
): Promise<GenerationResult> => {
  
  try {
    const prompt = `
    اجعل الشخص في الصورة الحديثة (الصورة الثانية) يعانق الشخص في الصورة القديمة (الصورة الأولى) وتكون بشكل احترافي مع اضاءة مناسبة تبدو وكأنها حقيقية.
    اجعل الخلفية ستار ناعم مع اضاءة مناسبة دافئة وحانية.
    يجب أن يكون العناق واقعيًا ومؤثرًا، يظهر الحب والاحتواء بين الذات الحالية والطفل الداخلي.
    حافظ على ملامح الوجه واضحة في كلتا الشخصيتين.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: youngImage.mimeType,
              data: youngImage.base64
            }
          },
          {
            inlineData: {
              mimeType: currentImage.mimeType,
              data: currentImage.base64
            }
          }
        ]
      },
      // Note: responseMimeType and responseSchema are NOT supported for nano banana series models
    });

    let generatedImageUrl: string | null = null;
    let generatedText: string | null = null;

    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          generatedImageUrl = `data:image/png;base64,${base64EncodeString}`;
        } else if (part.text) {
          generatedText = part.text;
        }
      }
    }

    if (!generatedImageUrl && !generatedText) {
      throw new Error("لم يتم توليد أي محتوى. يرجى المحاولة مرة أخرى.");
    }

    return {
      imageUrl: generatedImageUrl,
      text: generatedText
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
