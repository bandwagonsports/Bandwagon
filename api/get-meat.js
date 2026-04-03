import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  const { teamId } = req.query;
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    // 1. Fetch data from TheSportsDB (using their public dev key '123')
    const sportsData = await fetch(`https://www.thesportsdb.com/api/v1/json/123/eventslast.php?id=${teamId}`);
    const data = await sportsData.json();

    // 2. The "Professor Agent" Prompt
    const prompt = `You are a sports educator for casual fans. 
    Based on these scores: ${JSON.stringify(data.results)}, 
    explain why the most recent game matters in 2 sentences. 
    Focus on the "vibe" and one educational term (like 'Wild Card' or 'Clean Sheet'). 
    If no data is found, give a fun fact about the team's history.`;

    const result = await model.generateContent(prompt);
    res.status(200).json({ summary: result.response.text() });
  } catch (error) {
    res.status(500).json({ error: "Agent is sleeping. Try again later." });
  }
}
