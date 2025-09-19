const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");
const axios = require("axios");

const SUPABASE_JWKS = process.env.SUPABASE_JWKS || "https://<your-project-id>.supabase.co/auth/v1/jwks";

async function verifySupabaseToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    // Verify with Supabase JWKS
    const { data } = await axios.get(SUPABASE_JWKS);
    const signingKeys = data.keys.map(key => jwt.decode(token, { complete: true }).header.kid === key.kid && key);

    if (!signingKeys) throw new Error("No matching key");

    jwt.verify(token, signingKeys[0], { algorithms: ["RS256"] }, (err, decoded) => {
      if (err) return res.status(403).json({ error: "Invalid token" });
      req.user = decoded;
      next();
    });
  } catch (err) {
    return res.status(403).json({ error: "Token verification failed" });
  }
}

module.exports = verifySupabaseToken;
