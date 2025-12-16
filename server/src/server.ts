import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import dotenv from "dotenv";
import { connectDB } from "./config/db-config.js";
import http from "http";
import cookieParser from "cookie-parser";
import { initSocketServer } from "./socketioServer.js";
import { ErrorMiddleware } from "./shared/middlewares/error.js";
import notificationRoutes from "./routes/nottication.routes.js";
import printingRoutes from "./routes/printing.routes.js";
import { compressed_printing_files } from "./config/fileConfing.js";

dotenv.config();

const app = express();
app.use(cookieParser());
const server = http.createServer(app);
const PORT = process.env.PORT;
app.use("/thumbnails", express.static(compressed_printing_files));
app.use(cors({ origin: "https://alankar-shop-mangment-project-3c14.vercel.app", credentials: true }));
app.use(express.json());

app.use("/api/v1", authRoutes);
app.use("/api/v1", printingRoutes);
app.use("/api/v1", notificationRoutes);

app.use(ErrorMiddleware);

initSocketServer(server);
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`), connectDB();
});

