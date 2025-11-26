import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { db } from "./lib/db.js";
import { specsRouter } from "./routes/specs.js";
import { questionSessionRouter } from "./routes/questionSessions.js";

dotenv.config();

const app = express();

const rawCors = process.env.CORS_ORIGIN || "*";
const corsOrigins =
  rawCors === "*"
    ? "*"
    : rawCors
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

app.use(
  cors({
    origin: corsOrigins,
    credentials: true
  })
);
app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  try {
    db.prepare("SELECT 1").get();
    res.json({
      ok: true,
      status: "healthy",
      time: new Date().toISOString()
    });
  } catch (e) {
    res.status(500).json({ ok: false, status: "db_error" });
  }
});

// NOTE: auth/docs/share routers are assumed to be wired in your existing codebase.
// Here we only mount new v0.6.3 capabilities.
app.use("/api/specs", specsRouter);
app.use("/api/question-sessions", questionSessionRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`[promptly] backend v0.6.3 listening on :${PORT}`);
});
