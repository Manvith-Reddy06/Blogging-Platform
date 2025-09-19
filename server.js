const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const verifySupabaseToken = require("./middleware/verifySupabase");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/protected", verifySupabaseToken, (req, res) => {
  res.json({ message: "Secure data", user: req.user });
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
