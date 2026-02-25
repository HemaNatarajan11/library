import Book from "../models/Book.js";

export const addBook = async (req, res) => {
  const book = await Book.create(req.body);
  res.json(book);
};

export const getBooks = async (req, res) => {
  const books = await Book.find();
  res.json(books);
};
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    await book.deleteOne();

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    book.title = req.body.title;
    book.author = req.body.author;
    book.category = req.body.category;
    book.totalCopies = req.body.totalCopies;
    book.availableCopies = req.body.availableCopies;

    const updatedBook = await book.save();

    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
