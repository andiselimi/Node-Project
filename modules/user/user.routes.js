import express from "express";
import {createUser, getAllUsers, getOneUser, editUser, deleteUser, getMe, editMe, deleteMe, changePassword} from "./user.controller.js"
import { isAuthenticated, isAuthorized } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create", createUser);
router.get("/getAll", isAuthenticated, isAuthorized(["admin", "moderator"]), getAllUsers);
router.get("/getMe", isAuthenticated, isAuthorized(["admin", "moderator", "user"]), getMe);
router.put("/editMe", isAuthenticated, editMe);
router.delete("/deleteMe", isAuthenticated, deleteMe);
router.get("/getOneUser/:userId", isAuthenticated, getOneUser);
router.put("/editUser/:userId", isAuthenticated, isAuthorized(["admin", "moderator"]), editUser);
router.delete("/deleteUser/:userId", isAuthenticated, isAuthorized(["admin"]), deleteUser);
router.patch("/changePassword", isAuthenticated,  changePassword);

export default router;