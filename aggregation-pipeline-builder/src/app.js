import express from "express";
import analyticsRoutes from "./routes/analytics.routes.js";

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/analytics", analyticsRoutes);

// Health check
app.get("/", (req, res) => {
    res.send("Analytics API is running");
});

export default app;
