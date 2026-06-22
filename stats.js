// gets stats from db 
import { Pool } from "pg";
import jwt from "jsonwebtoken";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  const token = req.cookies.auth_token;

  if (!token) {
    return res.status(401).json({
      message: "No authentication token found",
    });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }

  const userId = decoded.userId;

  try {
    // -------------------------
    // Fetch CV data
    // -------------------------
    const cvQuery = `
      SELECT wins, losses, name
      FROM cvs
      WHERE user_id = $1
      LIMIT 1
    `;

    const { rows: cvRows } = await pool.query(cvQuery, [userId]);

    if (cvRows.length === 0) {
      return res.status(404).json({
        message: "CV not found",
      });
    }

    const cvData = cvRows[0];

    // -------------------------
    // Fetch profile data
    // -------------------------
    const profileQuery = `
      SELECT cola
      FROM profiles
      WHERE user_id = $1
      LIMIT 1
    `;

    const { rows: profileRows } = await pool.query(profileQuery, [userId]);

    if (profileRows.length === 0) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    const profileData = profileRows[0];

    return res.status(200).json({
      message: "Stats fetched successfully",
      data: {
        name: cvData.name,
        wins: cvData.wins,
        losses: cvData.losses,
        cola: profileData.cola,
      },
    });
  } catch (err) {
    console.error("Stats fetch error:", err);
    return res.status(500).json({
      message: "Server error",
    });
  }
}