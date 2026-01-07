
import { GoogleGenAI } from "@google/genai";

// Function to get response from Gemini consultant following latest @google/genai guidelines
export async function getConsultantResponse(prompt: string, history: { role: string, parts: { text: string }[] }[]) {
  // Always initialize GoogleGenAI with the API key from process.env.API_KEY within the function scope
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    // Call generateContent directly with the model name and contents.
    // For multi-turn, we provide an array of Content objects.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history.map(h => ({ 
          role: h.role === 'assistant' ? 'model' : 'user', 
          parts: h.parts 
        })),
        { parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: `Bạn là trợ lý ảo tư vấn chuyên nghiệp của "Mộ Đá Bá Khoát". 
        Cơ sở chúng tôi chuyên về đá mỹ nghệ, mộ đá, lăng thờ, cuốn thư và các công trình tâm linh tại Ninh Bình.
        Nhiệm vụ:
        1. Tư vấn về các loại đá (đá xanh, đá granite, đá trắng).
        2. Giải thích về kích thước phong thủy (Thước Lỗ Ban).
        3. Tư vấn các mẫu mộ đẹp.
        4. Luôn giữ thái độ trang trọng, lịch sự và am hiểu văn hóa tâm linh Việt Nam.
        5. Nhắc khách hàng để lại số điện thoại nếu cần tư vấn chuyên sâu hoặc báo giá.`,
        temperature: 0.7,
      }
    });

    // Extract the text output using the .text property (not a method)
    return response.text || "Xin lỗi, tôi chưa thể trả lời câu hỏi này.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Có lỗi xảy ra khi kết nối với chuyên gia. Quý khách vui lòng thử lại sau.";
  }
}
