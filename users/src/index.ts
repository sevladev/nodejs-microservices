import express from "express";

const app = express();

app.get("/users", (req, res) => {
  return res.json({ ok: true });
});

app.listen(3001, () => console.log("users service on port 3001"));
