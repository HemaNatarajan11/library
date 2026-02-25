import React, { useState } from "react";

const AddBook = () => {
  const [book, setBook] = useState({
    title: "",
    author: "",
    category: "",
    isbn: "",
    totalCopies: 1,
  });

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setBook({
      ...book,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("You are not logged in. Please login first.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...book,
          totalCopies: Number(book.totalCopies),
          availableCopies: Number(book.totalCopies), // important for backend
        }),
      });

      let data;

      // Try parsing JSON safely
      try {
        data = await response.json();
      } catch (err) {
        const text = await response.text(); // backend returned HTML (error page)
        console.error("Backend did not return JSON:", text);
        alert("Server error: check backend logs");
        return;
      }

      if (!response.ok) {
        alert(data.message || "Failed to add book");
        return;
      }

      alert("Book added successfully!");

      // Reset form
      setBook({
        title: "",
        author: "",
        category: "",
        isbn: "",
        totalCopies: 1,
      });
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add New Book</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Book Title"
          value={book.title}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="author"
          placeholder="Author Name"
          value={book.author}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={book.category}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="isbn"
          placeholder="ISBN"
          value={book.isbn}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          type="number"
          name="totalCopies"
          min="1"
          placeholder="Total Copies"
          value={book.totalCopies}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Add Book
        </button>
      </form>
    </div>
  );
};

export default AddBook;
