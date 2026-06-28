import express from "express";
import { chatWithMentor } from "../controllers/mentor.controller.js";
const router = express.Router();

router.route("/chat").post(chatWithMentor);

export default router;
