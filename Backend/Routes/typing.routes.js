import { getTypingHistory, saveTypingResult } from "../Controllers/typing.controller.js";
import express from 'express';


const typingRouter = express.Router()

typingRouter.post("/save", saveTypingResult);
typingRouter.get("/history", getTypingHistory);

export default typingRouter;