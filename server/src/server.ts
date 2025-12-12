import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import dotenv from "dotenv";
import { connectDB } from "./config/db-config.js";
import http from "http";
import { initSocketServer } from "./socketioServer.js";
import { ErrorMiddleware } from "./shared/middlewares/error.js";
import notificationRoutes from "./routes/nottication.routes.js";


dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use("/api/v1/", authRoutes);
app.use("/api/v1/", notificationRoutes);

app.use(ErrorMiddleware);

initSocketServer(server);
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`), connectDB();
});
