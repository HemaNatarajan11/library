import express from "express";
import Borrow from "../models/Borrow.js";
import {
  borrowBook,
  getAllBorrows,
  returnBook,
  getMyBooks,
} from "../controllers/borrowController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, borrowBook);
router.put("/return/:id", protect, returnBook);

router.get("/", protect, getAllBorrows);
router.get("/mybooks", protect, getMyBooks);

export default router;
