import express from "express";
import Borrow from "../models/Borrow.js";
import {
  borrowBook,
  getAllBorrows,
  returnBook,
} from "../controllers/borrowController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, borrowBook);
router.put("/return/:id", protect, returnBook);

router.get("/", protect, getAllBorrows);

export default router;
