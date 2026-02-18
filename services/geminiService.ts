
import { GoogleGenAI, Type } from "@google/genai";
import { Complaint, ComplaintPriority, Room } from "../types";

// Always use process.env.API_KEY directly for initialization
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const classifyComplaintPriority = async (description: string): Promise<ComplaintPriority> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Classify the priority of this hostel maintenance complaint: "${description}". 
      Return one of: LOW, MEDIUM, HIGH, CRITICAL. 
      Critical: Safety issues, severe leakage, total power failure. 
      Low: Minor furniture scratches, slow fan (not stopped).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            priority: {
              type: Type.STRING,
              description: "The classified priority level",
            }
          },
          required: ["priority"]
        }
      }
    });

    const result = JSON.parse(response.text || '{"priority": "MEDIUM"}');
    return (result.priority as ComplaintPriority) || ComplaintPriority.MEDIUM;
  } catch (error) {
    console.error("Gemini Priority Classification Error:", error);
    return ComplaintPriority.MEDIUM;
  }
};

export const getMaintenancePredictions = async (complaints: Complaint[]): Promise<string> => {
  try {
    const historicalData = complaints.map(c => `${c.category}: ${c.description}`).join('\n');
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on these past maintenance complaints in a hostel, provide a short predictive insight about what needs preventive maintenance next.
      
      Historical Data:
      ${historicalData}
      
      Provide a concise 2-sentence professional insight.`,
    });
    return response.text || "Insufficient data for predictive analytics.";
  } catch (error) {
    console.error("Gemini Prediction Error:", error);
    return "Unable to generate predictive insights at this time.";
  }
};

export const getSmartAllocationSuggestion = async (preferences: string[], availableRooms: Room[]): Promise<string> => {
  try {
    const roomsStr = availableRooms.map(r => `Room ${r.number} (${r.type}, ${r.features.join(', ')})`).join('\n');
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Given these student preferences: [${preferences.join(', ')}], and these available rooms:
      ${roomsStr}
      
      Suggest the best room and briefly explain why.`,
    });
    return response.text || "Consider Room 101 based on current availability.";
  } catch (error) {
    console.error("Gemini Allocation Error:", error);
    return "Suggest manual allocation for this case.";
  }
};
