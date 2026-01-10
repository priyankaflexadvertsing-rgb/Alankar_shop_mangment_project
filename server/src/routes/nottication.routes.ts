import { Router } from "express";
import { getNotifications, updateNotification } from "../controllers/nottification.controller.js";
import { authorizeRoles, isAuthenticated } from "../shared/middlewares/isAuthenticated.js";

const router = Router();

router.get("/notification-get", isAuthenticated, authorizeRoles("admin"), getNotifications)
router.put("/update_nottification/:id", isAuthenticated, authorizeRoles("admin"), updateNotification)

export default router;
