// api for rival battle 
import { Pool } from "pg";
import { GoogleGenAI } from "@google/genai";
import jwt from "jsonwebtoken";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req, res) {
  // Ensure it's a POST request since we're sending a body
  if (req.method !== 'POST') {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { rivalEmail } = req.body;

    if (!rivalEmail) {
      return res.status(400).json({ message: "Rival email is required" });
    }

    // Auth
    const token = req.cookies.auth_token;
    if (!token) return res.status(401).json({ message: "No token found" });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ message: "Invalid token" });
    }

    // -------------------------
    // 1. Get Player CV
    // -------------------------
    const playerQuery = `
      SELECT cv_text, name, user_id
      FROM cvs
      WHERE user_id = $1
      LIMIT 1
    `;
    const { rows: playerRows } = await pool.query(playerQuery, [decoded.userId]);
    const player = playerRows[0];

    if (!player) throw new Error("Your CV not found. Upload one first.");

    // -------------------------
    // 2. Get Specific Opponent by Email
    // -------------------------
    // Note: Adjust the JOIN if your email is stored in a 'users' table instead of 'profiles'
    // Since email is in the 'cvs' table, we just query it directly
     const opponentQuery = `
     SELECT cv_text, name, user_id
     FROM cvs
     WHERE email = $1
     LIMIT 1
     `;
    const { rows: opponentRows } = await pool.query(opponentQuery, [rivalEmail]);
    const opponent = opponentRows[0];

    if (!opponent) {
      return res.status(404).json({ message: "Rival not found or they haven't uploaded a CV." });
    }

    if (opponent.user_id === decoded.userId) {
      return res.status(400).json({ message: "You cannot battle yourself. That's just a mid-life crisis." });
    }

    // -------------------------
    // 3. AI Battle Logic
    // -------------------------
    const prompt = `
      You are an elite recruitment combat judge. 
      Analyze these two CVs and decide who wins in a "Professional Skills Battle."
      
      CV 1 (Player: ${player.name}): "${player.cv_text}"
      CV 2 (Opponent: ${opponent.name}): "${opponent.cv_text}"
      
      Respond ONLY in JSON format:
      {
        "victory": true (if CV 1 wins) or false (if CV 2 wins),
        "reason": "A 1-sentence witty roast or praise explaining why."
      }
    `;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite", // Ensure version is correct
      system_instruction: 'Respond ONLY in JSON: {"victory": boolean, "reason": "1-sentence roast"}',
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const responseText = result.candidates[0].content.parts[0].text;
    const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    const battleData = JSON.parse(cleanJson);

    // -------------------------
    // 4. Update Stats & Consume "Cola"
    // -------------------------
    const updateStats = async () => {
      // Update Wins/Losses for both parties
      if (battleData.victory) {
        await pool.query(`UPDATE cvs SET wins = wins + 1 WHERE user_id = $1`, [decoded.userId]);
        await pool.query(`UPDATE cvs SET losses = losses + 1 WHERE user_id = $1`, [opponent.user_id]);
      } else {
        await pool.query(`UPDATE cvs SET losses = losses + 1 WHERE user_id = $1`, [decoded.userId]);
        await pool.query(`UPDATE cvs SET wins = wins + 1 WHERE user_id = $1`, [opponent.user_id]);
      }

      // Deduct energy from the attacker
      await pool.query(`UPDATE profiles SET cola = cola - 1 WHERE user_id = $1`, [decoded.userId]);
    };

    updateStats();

    // -------------------------
    // 5. Final Response
    // -------------------------
    return res.status(200).json({
      victory: battleData.victory,
      msg: battleData.reason,
      opponentName: opponent.name,
    });

  } catch (error) {
    console.error("BATTLE_ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
}