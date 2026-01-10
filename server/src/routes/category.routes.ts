import { Router } from "express";
import { authorizeRoles, isAuthenticated } from "../shared/middlewares/isAuthenticated.js";
import { createCategory, deleteCategory, getAllCategories, getSingleCategory, updateCategory } from "../controllers/category.controller.js";

const router = Router();

router.post("/category", isAuthenticated, authorizeRoles("admin"), createCategory);
router.get("/categories", getAllCategories);
router.get("/category/:id", getSingleCategory);
router.put("/category/:id", isAuthenticated, authorizeRoles("admin"), updateCategory);
router.delete("/category/:id", isAuthenticated, authorizeRoles("admin"), deleteCategory);


export default router;
