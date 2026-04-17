import { AnalysisResult, WorkshopData } from "../types";
import { formatDate } from "../lib/utils";

const GAS_URL = (import.meta as any).env.VITE_GAS_URL;

export const saveToGoogleSheets = async (result: AnalysisResult): Promise<boolean> => {
  if (!GAS_URL) {
    console.warn("GAS_URL이 설정되지 않았습니다. 데이터를 저장할 수 없습니다.");
    return false;
  }

  try {
    const payload = {
      items: result.items.map(item => ({
        ...item,
        timestamp: formatDate(new Date())
      }))
    };

    const response = await fetch(GAS_URL, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "text/plain;charset=utf-8", // GAS often requires text/plain to avoid CORS preflight issues with simple triggers
      },
      mode: "no-cors" // no-cors is common for GAS because it doesn't always handle OPTIONS requests well unless handled explicitly
    });

    // In no-cors mode, we can't read the response body or status, but we assume success if no error is thrown
    return true;
  } catch (error) {
    console.error("구글 시트 저장 실패:", error);
    return false;
  }
};
