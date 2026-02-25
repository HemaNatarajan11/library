import React, { useEffect, useState } from "react";

const SearchBooks = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase()) ||
      book.category.toLowerCase().includes(search.toLowerCase()),
  );

  const handleIssue = async (bookId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/borrow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookId }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Book issued successfully!");

      // Refresh books
      const updated = await fetch("http://localhost:5000/api/books");
      const updatedData = await updated.json();
      setBooks(updatedData);
    } catch (error) {
      console.error(error);
      alert("Server error. Check backend logs.");
    }
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/books");
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBooks();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Search Books</h2>

      <input
        type="text"
        placeholder="Search by title, author, or category..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-80 m-5 p-3 rounded-xl border border-gray-300 shadow-sm"
      />

      {filteredBooks.length === 0 ? (
        <p className="text-gray-500">No books found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book._id}
              className="bg-white p-6 rounded-2xl shadow-lg flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-semibold text-indigo-600 mb-2">
                  {book.title}
                </h3>
                <p>Author: {book.author}</p>
                <p>Category: {book.category}</p>
                <p className="text-gray-500 mt-1">
                  Available: {book.availableCopies}
                </p>
              </div>

              <div className="mt-4">
                {book.availableCopies > 0 ? (
                  <button
                    onClick={() => handleIssue(book._id)}
                    className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
                  >
                    Issue Book
                  </button>
                ) : (
                  <span className="text-red-600 font-semibold">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBooks;
