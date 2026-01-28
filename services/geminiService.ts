import { GoogleGenAI, Type } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key not found in environment variables");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateDiagnosis = async (
  deviceModel: string,
  issueDescription: string,
  visualObservations: string
): Promise<{ diagnosis: string; estimatedCost: number; recommendedAction: string } | null> => {
  const ai = getAiClient();
  if (!ai) return null;

  try {
    const model = 'gemini-2.5-flash';
    
    const prompt = `
      Atue como um técnico sênior de reparo de celulares.
      Analise os seguintes dados:
      Modelo: ${deviceModel}
      Relato do Cliente: ${issueDescription}
      Observações Visuais: ${visualObservations}

      Gere um diagnóstico técnico profissional, uma estimativa de custo (em BRL, apenas o número) baseada em preços médios de mercado no Brasil, e uma ação recomendada.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            diagnosis: { type: Type.STRING, description: "Relatório técnico profissional" },
            estimatedCost: { type: Type.NUMBER, description: "Custo estimado em Reais" },
            recommendedAction: { type: Type.STRING, description: "Ação recomendada (ex: Troca de peça, Limpeza)" }
          },
          required: ["diagnosis", "estimatedCost", "recommendedAction"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating diagnosis:", error);
    return null;
  }
};