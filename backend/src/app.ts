import express from "express";
import cors from "cors";
import morgan from "morgan";
import teamRoutes from "./routes/team.routes";
import playerRoutes from "./routes/player.routes";
import matchRoutes from "./routes/match.routes";
import goalRoutes from "./routes/goal.routes";
import reportRoutes from "./routes/report.routes";
import seasonRoutes from "./routes/season.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/teams", teamRoutes);
app.use("/players", playerRoutes);
app.use("/matches", matchRoutes);
// Results are now handled by match routes: /matches/results/*
app.use("/results", matchRoutes); // Redirect /results to match routes for backward compatibility
app.use("/goals", goalRoutes);
app.use("/reports", reportRoutes);
app.use("/seasons", seasonRoutes);

// Debug: Log registered routes
console.log("Registered routes:");
console.log("  GET  /reports/teams/stats");
console.log("  GET  /reports/players/stats");
console.log("  GET  /seasons");

export default app;
