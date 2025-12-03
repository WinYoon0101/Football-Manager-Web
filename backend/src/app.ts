import express from "express";
import cors from "cors";
import morgan from "morgan";
import teamRoutes from "./routes/team.routes";
import playerRoutes from "./routes/player.routes";
import matchRoutes from "./routes/match.routes";
import goalRoutes from "./routes/goal.routes";
import reportRoutes from "./routes/report.routes";
import seasonRoutes from "./routes/season.routes";
import authRoutes from "./routes/auth.routes";
import parameterRoutes from "./routes/parameter.routes";
import applicationRoutes from "./routes/application.route";
import userRoutes from "./routes/user.route";
const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true, // Cho phép gửi cookie/token
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.use("/teams", teamRoutes);
app.use("/players", playerRoutes);
app.use("/matches", matchRoutes);
app.use("/auth", authRoutes);
// Results are now handled by match routes: /matches/results/*
app.use("/results", matchRoutes); // Redirect /results to match routes for backward compatibility
app.use("/goals", goalRoutes);
app.use("/reports", reportRoutes);
app.use("/seasons", seasonRoutes);
app.use("/parameters", parameterRoutes);
app.use("/applications", applicationRoutes);
app.use("/users", userRoutes);



// Debug: Log registered routes
console.log("Registered routes:");
console.log("  GET  /reports/teams/stats");
console.log("  GET  /reports/players/stats");
console.log("  GET  /seasons");

export default app;
