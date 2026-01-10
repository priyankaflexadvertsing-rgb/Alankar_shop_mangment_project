import { Router } from "express";
import { isAuthenticated } from "../shared/middlewares/isAuthenticated.js";
import { upload } from "../shared/utils/multer.js";
import { allPrinting, deletePrinting, getAllPrinting, updatePrinting, updateprintingStatus, uploadPrinting, } from "../controllers/printing.controller.js";
import { isPrintingStatus } from "../shared/middlewares/isPrintingStatus.js";
const router = Router();
// printing upload API
router.post("/printing/upload", isAuthenticated, upload.array("images", 10), uploadPrinting);
router.get("/printing", isAuthenticated, getAllPrinting);
router.get("/allprinting", isAuthenticated, allPrinting);
router.patch("/printing/:id", isAuthenticated, isPrintingStatus, updatePrinting);
router.delete("/printing/:id", isAuthenticated, isPrintingStatus, deletePrinting);
router.patch("/updateprintingStatus/:id", isAuthenticated, isPrintingStatus, updateprintingStatus);
export default router;
