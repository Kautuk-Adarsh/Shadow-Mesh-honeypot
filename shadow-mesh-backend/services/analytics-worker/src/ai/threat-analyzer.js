const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeThreat = async (username, password) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
    You are an expert cybersecurity threat analyst. Analyze this SSH login attempt:
    Username: "${username}"
    Password: "${password}"

    Assess the threat level. 
    - Is it a common default router/server credential?
    - Is it a targeted attack using a specific name?
    - Is it a random keyboard smash?

    Respond ONLY with a valid JSON object in this exact format. Do not use markdown blocks (\`\`\`json). Just the raw JSON:
    {
      "threatScore": <number from 1 to 10>,
      "attackType": "<string: Bot Brute-Force, Targeted, Default Credential, etc>",
      "analysis": "<1 short sentence explaining why>"
    }
    `;
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(cleanJson);

  } catch (error) {
    console.error(" AI Analysis failed:", error);
    return { threatScore: 0, attackType: "Unknown", analysis: "AI offline" };
  }
};

module.exports = { analyzeThreat };