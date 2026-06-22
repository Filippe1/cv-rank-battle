// auth + send all pdf stuff to db
// create or replace stuff
import { Pool } from "pg";
import jwt from "jsonwebtoken";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { text, rankName, isPublic } = req.body;

  // Auth via cookie
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

  try {
    // -------------------------
    // Real data
    // -------------------------
    const user_id = decoded.userId;
    const email = decoded.email;

    // -------------------------
    // UPSERT into PostgreSQL
    // -------------------------
    const query = `
      INSERT INTO cvs (user_id, email, name, cv_text, is_public)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (user_id)
      DO UPDATE SET
        email = EXCLUDED.email,
        name = EXCLUDED.name,
        cv_text = EXCLUDED.cv_text,
        is_public = EXCLUDED.is_public
      RETURNING *
    `;

    const values = [
      user_id,
      email,
      rankName || "Anonymous CV",
      text,
      isPublic ?? true,
    ];

    const { rows } = await pool.query(query, values);

    return res.status(200).json({
      message: "CV saved successfully",
      data: rows[0],
    });
  } catch (err) {
    console.error("DB error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}