import express from "express";
import cors from "cors";
import morgan from "morgan";
import teamRoutes from "./routes/team.routes";
import playerRoutes from "./routes/player.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/teams", teamRoutes);
app.use("/players", playerRoutes);

export default app;
