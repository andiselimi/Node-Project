import express from "express";
import { createField, getAllFields, getOneField, editField, deleteField, addReview } from "./field.controller.js";
import { isAuthenticated, isAuthorized } from "../../middleware/auth.middleware.js";
import upload from "../../config/multer.js";

const router = express.Router();

router.post("/createField", isAuthenticated, isAuthorized(["admin"]), upload.single("image"), createField);
router.get("/getAllFields", getAllFields);
router.get("/getOneField/:fieldId", getOneField);
router.put("/editField/:fieldId", isAuthenticated, isAuthorized(["admin", "moderator"]), upload.single("image"), editField);
router.delete("/deleteField/:fieldId", isAuthenticated, isAuthorized(["admin"]),deleteField);
router.post("/addReview/:fieldId", isAuthenticated, addReview);

export default router;