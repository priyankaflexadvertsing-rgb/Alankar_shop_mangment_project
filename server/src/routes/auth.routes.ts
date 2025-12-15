import { Router } from "express";
import {
  getTeamMembers,
  refreshToken,
  socialAuth,
  userActivate,
  userGet,
  userGetAll,
  userLoggedOut,
  userLogin,
  userRegistration,
} from "../controllers/auth.controller.js";
import {
  authorizeRoles,
  isAuthenticated,
} from "../shared/middlewares/isAuthenticated.js";

const router = Router();

router.post("/registration", userRegistration);
router.post("/login", userLogin);
router.post("/activated", userActivate);
router.get("/social-auth", socialAuth);
router.post("/refresh-token", refreshToken);
router.get("/logged-out", isAuthenticated, userLoggedOut);
router.get("/get-user", isAuthenticated, userGet);
router.get("/users", isAuthenticated, authorizeRoles("admin"), userGetAll);
router.get("/team-members", isAuthenticated, authorizeRoles("admin"), getTeamMembers);

export default router;
