import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import express from "express";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "http://localhost:5173";

const DJX_BASE_URL = process.env.VITE_DJX_BASE_URL;
const USERNAME = process.env.VITE_DJX_USERNAME;
const PASSWORD = process.env.VITE_DJX_PASSWORD;

app.use(express.json());
app.use(
  cors({
    origin: ALLOWED_ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Access-Control-Allow-Headers"],
    credentials: true,
  })
);

app.use(express.static(path.join(__dirname, "dist")));

app.get("/api/sensors", async (req, res) => {
  try {
    const response = await fetch(`${DJX_BASE_URL}/m2m/provisioning/v2/sensors?count=100&expand=resources,attributes`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${Buffer.from(`${USERNAME}:${PASSWORD}`).toString("base64")}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching sensors:", error);
    res.status(500).json({ error: "Failed to fetch sensors data" });
  }
});

app.get("/api/resource", async (req, res) => {
  try {
    const { uri } = req.query;

    if (!uri) {
      return res.status(400).json({ error: "Resource URI is required" });
    }

    const response = await fetch(`${DJX_BASE_URL}/m2m/data?res=${uri}`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${Buffer.from(`${USERNAME}:${PASSWORD}`).toString("base64")}`,
        Accept: "application/vnd.ericsson.m2m.output+json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching resource data:", error);
    res.status(500).json({ error: "Failed to fetch resource data" });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Express server running at ${process.env.VITE_BACKEND_URL}/`);
});
