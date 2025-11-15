import express from "express";
import cors from "cors";
import morgan from "morgan";
import teamRoutes from "./routes/team.routes";


const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/teams", teamRoutes);


export default app;
