// fetch from leaderboard
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const query = `
      SELECT name, wins, losses
      FROM cvs
      WHERE is_public = true
      ORDER BY wins DESC
      LIMIT 30
    `;

    const { rows } = await pool.query(query);

    return res.status(200).json({
      leaderboard: rows,
    });
  } catch (err) {
    console.error("Leaderboard fetch error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}