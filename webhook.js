// polar webhook
// File: /pages/api/webhooks/polar.js
import { validateEvent, WebhookVerificationError } from '@polar-sh/sdk/webhooks';
import getRawBody from 'raw-body';
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const rawBody = await getRawBody(req);
    const event = validateEvent(
      rawBody,
      req.headers,
      process.env.POLAR_WEBHOOK_SECRET
    );

    if (event.type === 'order.paid') {

      // manually inserted code: 
      const data = event.data || {};

      const email =
        data.customer?.email ||
        data.user?.email ||
        null;

      const productId =
        data.product_id ||
        data.product?.id ||
        null;

      const orderId =
        data.id ||
        null;



      if (!email || !productId || !orderId) {
        console.warn('Missing required fields');
        return res.status(200).end();
      }

      // 🔹 Credit mapping
      const PRODUCT_CREDITS_MAP = {
        "bce2f06f-d85c-44d4-a20c-ebcb6926622f": 50,
        "9c8a6953-d389-48aa-94f5-d26bfee765f0": 150
      };

      // --- ADDED FILTER START ---
      // Check if the productId from the webhook exists in your map keys
      if (!(productId in PRODUCT_CREDITS_MAP)) {
        console.log(`Skipping: Product ID ${productId} is not in the allowed list.`);
        return res.status(202).send('Ignored: Product ID mismatch');
      }

      const credits = PRODUCT_CREDITS_MAP[productId] || 0;

      console.log('EMAIL:', email);
      console.log('PRODUCT ID:', productId);
      console.log('CREDITS:', credits);

      // 🔹 1. Store purchase (idempotent)
      await pool.query(
        `INSERT INTO purchases (id, email, product_id, credits, applied)
         VALUES ($1, $2, $3, $4, FALSE)
         ON CONFLICT (id) DO NOTHING`,
        [orderId, email, productId, credits]
      );

      // 🔹 2. Check if user exists
      const { rows } = await pool.query(
        `SELECT id FROM users WHERE email = $1`,
        [email]
      );

      const userExists = rows.length > 0;

      if (userExists) {
        console.log('User exists → applying credits');

        // 🔹 3. Apply credits
        await pool.query(
          `UPDATE profiles SET cola = cola + $1 WHERE email = $2`,
          [credits, email]
        );

        // 🔹 4. Mark purchase as applied
        await pool.query(
          `UPDATE purchases SET applied = TRUE WHERE id = $1`,
          [orderId]
        );
      } else {
        console.log('User does NOT exist → stored for later');
      }
    }

    res.status(202).send('');
  } catch (error) {
    if (error instanceof WebhookVerificationError) {
      return res.status(403).send('');
    }
    console.error(error);
    res.status(500).end();
  }
}