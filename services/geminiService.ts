
import { GoogleGenAI, Type } from "@google/genai";
import { ComparisonResponse, Shoe } from "../types";

const API_KEY = process.env.API_KEY as string;

export async function fetchShoeComparison(): Promise<ComparisonResponse> {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  // 核心指令：要求最新型號、momo 連結、繁體中文
  const prompt = `請搜尋並比較以下 2024-2025 最新旗艦級碳板馬拉松跑鞋：
  1. Adidas Adizero Adios Pro 4 (必須是最新第四代，取代 Pro 3)
  2. Nike Alphafly 3
  3. ASICS Metaspeed Sky Paris 或 Edge Paris
  
  特別要求：
  - 【商品連結】：請務必尋找這三款鞋在「momo 購物網 (momo.com.tw)」的商品賣場連結。如果 momo 暫無該尺寸或型號，請提供 momo 的搜尋結果頁面連結。
  - 全部內容請使用「繁體中文 (zh-TW)」。
  
  回傳資料格式需求：
  - 品牌與完整型號
  - 目前 momo 上的價格 (TWD)
  - 核心性能特性 (中文描述)
  - 重量 (公克)
  - 足尖差 (Drop)
  - 針對三款鞋的專業對比總結。`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          shoes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                brand: { type: Type.STRING },
                model: { type: Type.STRING },
                category: { type: Type.STRING },
                price: { type: Type.STRING },
                features: { type: Type.ARRAY, items: { type: Type.STRING } },
                weight: { type: Type.STRING },
                drop: { type: Type.STRING },
                link: { type: Type.STRING, description: "必須是 momo.com.tw 的連結" },
              },
              required: ["brand", "model", "price", "link"]
            }
          },
          summary: { type: Type.STRING }
        },
        required: ["shoes", "summary"]
      }
    },
  });

  const searchUrls = response.candidates?.[0]?.groundingMetadata?.groundingChunks
    ?.map((chunk: any) => chunk.web?.uri)
    .filter(Boolean) || [];

  return {
    ...JSON.parse(response.text || "{}"),
    searchUrls
  };
}

export async function generateInfographic(shoes: Shoe[]): Promise<string | null> {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const shoeList = shoes.map(s => `${s.brand} ${s.model} (Weight: ${s.weight}, Drop: ${s.drop})`).join(", ");
  
  // 強化視覺差異與數據對比的提示詞
  const prompt = `Create a professional data-driven performance comparison infographic for: ${shoeList}.
  VISUAL DESIGN RULES:
  1. STRUCTURE: A side-by-side technical comparison layout.
  2. METRICS: Display 3 horizontal bar charts for EACH shoe comparing: "Energy Return", "Cushioning", and "Stability". 
  3. CONTRAST: Use high-contrast colors to distinguish models (Neon Orange for Nike, Cyan Blue for Adidas, Acid Green for ASICS).
  4. DATA LABELS: Include specific performance percentages or scores (e.g., "98% Speed") next to the bars to highlight differences.
  5. WEIGHT SCALE: Create a visual "Weight Balance" graphic showing which shoe is the lightest.
  6. STYLE: Dark carbon-fiber texture background, futuristic tech UI elements, very clear white typography.
  7. SHOE GRAPHICS: Include stylized silhouettes or wireframe renders of the shoes to show their different stack heights and shapes.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (error) {
    console.error("Image generation failed:", error);
  }
  return null;
}
