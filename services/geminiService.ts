import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedMetadata } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to convert File to Base64
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g. "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateGifMetadata = async (file: File): Promise<GeneratedMetadata> => {
  if (!process.env.API_KEY) {
    console.warn("No API Key provided for Gemini.");
    return {
      title: "Untitled GIF",
      tags: ["uploaded", "new"],
      description: "No description available."
    };
  }

  try {
    const base64Data = await fileToGenerativePart(file);

    const model = "gemini-3-flash-preview"; // Using Flash for speed

    const prompt = "Analyze this image. Provide a catchy Title, a list of 5-10 relevant Tags (lowercase), and a short Description suitable for SEO.";

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
            { inlineData: { mimeType: file.type, data: base64Data } },
            { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            tags: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            description: { type: Type.STRING }
          },
          required: ["title", "tags", "description"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    return JSON.parse(text) as GeneratedMetadata;

  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      title: "New Upload",
      tags: ["gif", "upload"],
      description: "An uploaded image."
    };
  }
};

export const generateImageFromPrompt = async (prompt: string, type: 'sticker' | 'general'): Promise<string | null> => {
  if (!process.env.API_KEY) {
    console.warn("No API Key provided.");
    return null;
  }

  // Refine prompt based on type
  let finalPrompt = prompt;
  if (type === 'sticker') {
    finalPrompt = `Generate a high-quality die-cut sticker of: ${prompt}. Vector art style, bold outlines, white border, isolated on a plain background, vibrant colors.`;
  } else {
    finalPrompt = `Create a high-quality image of: ${prompt}. Detailed, professional, visually striking.`;
  }

  try {
    // Using gemini-2.5-flash-image for general generation per system instructions
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: finalPrompt }]
      }
    });

    // Extract base64 image from response
    if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error("Image Generation Error:", error);
    return null;
  }
};
