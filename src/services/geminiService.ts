import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "" 
});

export const analyzeWorkshopOutput = async (
  base64Image: string,
  projectName: string,
  groupNumber: string
): Promise<AnalysisResult> => {
  const model = "gemini-3-flash-preview";

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `당신은 워크숍 산출물 분석 전문가입니다. 
제공된 이미지(워크숍 결과물, 포스트잇 등)에서 텍스트를 고정확도로 인식하고 구조화된 데이터를 생성하세요.
특히 '수기 텍스트(Handwriting)'를 오타 없이 정확하게 인식하는 것이 가장 중요합니다.

분석 규칙:
1. 이미지 내의 모든 개별 포스트잇이나 텍스트 영역을 빠짐없이 찾으세요.
2. 각 항목에 대해 [카테고리, 내용, 신뢰도 점수(0-1)]를 추출하세요.
3. 카테고리는 내용에 따라 적절히 분류하세요 (예: 인사이트, 아이디어, 문제점, 기대효과 등).
4. 수기 텍스트의 맥락을 고려하여 불분명한 글자도 최대한 정확하게 유추하여 텍스트화하세요.
5. 전체적인 내용을 요약한 조별 산출물 요약문도 작성하세요.
6. 프로젝트명은 "${projectName}", 조 번호는 "${groupNumber}"입니다.

결과는 다음 JSON 형식으로만 응답하세요:
{
  "items": [
    { "category": "기술", "content": "내용...", "confidence": 0.95, "projectName": "${projectName}", "groupNumber": "${groupNumber}" }
  ],
  "summary": "전체 요약..."
}`
          },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image
            }
          }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                content: { type: Type.STRING },
                confidence: { type: Type.NUMBER },
                projectName: { type: Type.STRING },
                groupNumber: { type: Type.STRING }
              },
              required: ["category", "content", "confidence", "projectName", "groupNumber"]
            }
          },
          summary: { type: Type.STRING }
        },
        required: ["items", "summary"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("분석 결과가 없습니다.");
  
  return JSON.parse(text) as AnalysisResult;
};
