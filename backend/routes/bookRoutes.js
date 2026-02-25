import express from "express";
import {
  addBook,
  getBooks,
  deleteBook,
  updateBook,
} from "../controllers/bookController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addBook);
router.get("/", getBooks);
router.delete("/:id", protect, deleteBook);
router.put("/:id", protect, updateBook);

export default router;
