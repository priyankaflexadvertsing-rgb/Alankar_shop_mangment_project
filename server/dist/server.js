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
import socialAuthRoutes from "./routes/social-auth.routes.js";
import { compressed_printing_files, oringinal_printing_files } from "./config/fileConfing.js";
import "./config/passport.js";
dotenv.config();
const app = express();
app.use(cookieParser());
const server = http.createServer(app);
const PORT = process.env.PORT;
app.use("/thumbnails", express.static(compressed_printing_files));
app.use("/original_printing", express.static(oringinal_printing_files));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use("/api/v1", authRoutes);
app.use("/api/v1", printingRoutes);
app.use("/api/v1", notificationRoutes);
app.use("/auth", socialAuthRoutes);
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        massage: "API is running..."
    });
});
// app.all("*", (req, res) => {
//   res.status(404).json({
//     success: false,
//     massage: "API is not running..."
//   });
// });
app.use(ErrorMiddleware);
initSocketServer(server);
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`), connectDB();
});
