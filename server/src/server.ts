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
import categoryRoutes from "./routes/category.routes.js";
import productRoutes from "./routes/product.routes.js";
import {
  compressed_printing_files,
  oringinal_printing_files
} from "./config/fileConfing.js";
import "./config/passport.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT;

/* -------------------- GLOBAL MIDDLEWARE -------------------- */
app.use(cookieParser());
app.use(
  cors({
    origin: "http://alankar-shop-mangment-project.vercel.app",
    credentials: true
  })
);

app.use(express.json());

/* -------------------- STATIC FILES (FIXED) -------------------- */

// Thumbnails (preview only)
app.use(
  "/thumbnails",
  express.static(compressed_printing_files, {
    setHeaders: (res) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
    }
  })
);

// ORIGINAL PRINT FILES (DOWNLOAD ENABLED)
app.use(
  "/original_printing",
  express.static(oringinal_printing_files, {
    setHeaders: (res, path) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");

      // 🔥 FORCE DOWNLOAD
      res.setHeader("Content-Disposition", "attachment");
    }
  })
);

/* -------------------- ROUTES -------------------- */
app.use("/api/v1", authRoutes);
app.use("/api/v1", printingRoutes);
app.use("/api/v1", notificationRoutes);
app.use("/auth", socialAuthRoutes);
app.use("/api/v1",categoryRoutes );
app.use("/api/v1",productRoutes );

/* -------------------- HEALTH CHECK -------------------- */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running..."
  });
});

/* -------------------- ERROR HANDLER -------------------- */
app.use(ErrorMiddleware);

/* -------------------- SOCKET + SERVER -------------------- */
initSocketServer(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
