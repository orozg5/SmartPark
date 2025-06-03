import cors from "cors";
import express from "express";
import dotenv from "dotenv";
dotenv.config();

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

app.get("/api/resource/:resourceUri", async (req, res) => {
  try {
    const { resourceUri } = req.params;
    const response = await fetch(`${DJX_BASE_URL}/m2m/data?res=${resourceUri}`, {
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

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});
