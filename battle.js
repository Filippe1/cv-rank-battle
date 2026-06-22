import { Pool } from "pg";
import { GoogleGenAI } from "@google/genai";
import jwt from "jsonwebtoken";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req, res) {
  try {
    // Auth
    const token = req.cookies.auth_token;

    if (!token) {
      return res.status(401).json({
        message: "No authentication token found",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }

    console.log("Token data:", decoded);

    // -------------------------
    // 1. Get Player CV
    // -------------------------
    const playerQuery = `
      SELECT cv_text, name
      FROM cvs
      WHERE user_id = $1
      LIMIT 1
    `;

    const { rows: playerRows } = await pool.query(playerQuery, [decoded.userId]);
    const player = playerRows[0];

    if (!player) {
      throw new Error("Player CV not found");
    }

    // -------------------------
    // 2. Get Random Opponent
    // -------------------------
    // (Simpler + faster than count + offset)
    const opponentQuery = `
      SELECT *
      FROM cvs
      WHERE user_id != $1
      ORDER BY RANDOM()
      LIMIT 1
    `;

    const { rows: opponentRows } = await pool.query(opponentQuery, [decoded.userId]);
    const opponent = opponentRows[0];

    if (!opponent) {
      throw new Error("No opponents available");
    }

    // -------------------------
    // 3. AI Battle
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
      model: "gemini-2.5-flash-lite",
      system_instruction:
        'Respond ONLY in JSON: {"victory": boolean, "reason": "1-sentence roast"}',
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        thinkingConfig: {
          includeThoughts: false,
          thinkingBudget: 0,
        },
      },
    });

    if (!result.candidates || result.candidates.length === 0) {
      throw new Error("AI failed to generate a response candidate.");
    }

    const responseText = result.candidates[0].content.parts[0].text;

    const cleanJson = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const battleData = JSON.parse(cleanJson);

    // -------------------------
    // 4. Update Stats (replaces RPC)
    // -------------------------
    const updateStats = async () => {
      if (battleData.victory) {
        await pool.query(`UPDATE cvs SET wins = wins + 1 WHERE user_id = $1`, [
          decoded.userId,
        ]);
        await pool.query(`UPDATE cvs SET losses = losses + 1 WHERE user_id = $1`, [
          opponent.user_id,
        ]);
      } else {
        await pool.query(`UPDATE cvs SET losses = losses + 1 WHERE user_id = $1`, [
          decoded.userId,
        ]);
        await pool.query(`UPDATE cvs SET wins = wins + 1 WHERE user_id = $1`, [
          opponent.user_id,
        ]);
      }

      await pool.query(
        `UPDATE profiles SET cola = cola - 1 WHERE user_id = $1`,
        [decoded.userId]
      );
    };

    updateStats(); // fire-and-forget (same as your original)

    // -------------------------
    // 5. Response
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