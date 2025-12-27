import { Router } from "express";
import { isAuthenticated } from "../shared/middlewares/isAuthenticated.js";
import { upload } from "../shared/utils/multer.js";
import {
  deletePrinting,
  getAllPrinting,
  updatePrinting,
  uploadPrinting,
} from "../controllers/printing.controller.js";
import { isPrintingStatus } from "../shared/middlewares/isPrintingStatus.js";

const router = Router();

// printing upload API
router.post("/printing/upload", isAuthenticated, upload.array("images", 10), uploadPrinting);
router.get("/printing", isAuthenticated, getAllPrinting);
router.patch("/printing/:id", isAuthenticated, isPrintingStatus, updatePrinting);
router.delete("/printing/:id", isAuthenticated, isPrintingStatus, deletePrinting);

export default router;
