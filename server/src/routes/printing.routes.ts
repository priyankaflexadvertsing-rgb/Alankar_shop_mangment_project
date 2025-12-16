import { Router } from "express";
import { authorizeRoles, isAuthenticated } from "../shared/middlewares/isAuthenticated.js";
import { upload } from "../shared/utils/multer.js";
import {
  deletePrinting,
  getAllPrinting,
  updatePrinting,
  uploadPrinting,
} from "../controllers/printing.controller.js";

const router = Router();

// printing upload API
router.post("/printing/upload", isAuthenticated, upload.array("images", 10), uploadPrinting);
router.get("/printing", isAuthenticated, getAllPrinting);
router.patch("/printing/:id", isAuthenticated, authorizeRoles("admin"), updatePrinting);
router.delete("/printing/:id", isAuthenticated, authorizeRoles("admin"), deletePrinting);

export default router;
