import { Router } from "express";
import * as messageService from "./message.service.js";

const messageController = Router();
messageController.post("/send", async (req, res) => {
  const success = await messageService.sendMessage(req.body);
  res.status(201).json({ success });
});

export default messageController;
