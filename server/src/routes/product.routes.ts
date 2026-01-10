import { Router } from "express";
import { authorizeRoles, isAuthenticated } from "../shared/middlewares/isAuthenticated.js";
import { upload } from "../shared/utils/multer.js";
import { createProduct, deleteProduct, getAllProducts, getSingleProduct, updateProduct } from "../controllers/products.controller.js";

const router = Router();

router.post("/product", isAuthenticated, authorizeRoles("admin"), upload.array("files"), createProduct);
router.get("/products", getAllProducts);
router.get("/product/:id", getSingleProduct);
router.put("/product/:id", isAuthenticated, authorizeRoles("admin"), updateProduct);
router.delete("/product/:id", isAuthenticated, authorizeRoles("admin"), deleteProduct);


export default router;
