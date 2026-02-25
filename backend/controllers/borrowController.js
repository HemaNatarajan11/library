import Borrow from "../models/Borrow.js";
import Book from "../models/Book.js";
import User from "../models/User.js";

// Borrow a Book
export const borrowBook = async (req, res) => {
  try {
    const { bookId } = req.body;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.availableCopies <= 0)
      return res.status(400).json({ message: "No copies available" });

    const borrow = await Borrow.create({
      student: req.user._id,
      book: bookId,
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: "issued",
    });

    book.availableCopies -= 1;
    await book.save();

    const populatedBorrow = await Borrow.findById(borrow._id)
      .populate("student", "username email")
      .populate("book", "title author category");

    res.json(populatedBorrow);
  } catch (error) {
    console.error("Error in borrowBook:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllBorrows = async (req, res) => {
  try {
    const borrows = await Borrow.find()
      .populate("student", "username email")
      .populate("book", "title author category");

    res.json(borrows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const returnBook = async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.id);
    if (!borrow)
      return res.status(404).json({ message: "Borrow record not found" });

    if (borrow.status !== "issued")
      return res.status(400).json({ message: "Book is not currently issued" });

    borrow.status = "returned";
    await borrow.save();

    const book = await Book.findById(borrow.book);
    if (book) {
      book.availableCopies += 1;
      await book.save();
    }

    const populatedBorrow = await Borrow.findById(borrow._id)
      .populate("student", "username email")
      .populate("book", "title author category");

    res.json(populatedBorrow);
  } catch (error) {
    console.error("Error in returnBook:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyBooks = async (req, res) => {
  try {
    const borrows = await Borrow.find({ student: req.user._id })
      .populate("book", "title author category")
      .populate("student", "username email");

    res.json(borrows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};
