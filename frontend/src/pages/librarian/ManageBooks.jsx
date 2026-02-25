import React, { useState, useEffect } from "react";

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  const token = localStorage.getItem("token");

  // ✅ Fetch Books From Backend
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/books", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBooks();
  }, [token]);

  // ✅ Delete Book
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/books/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.message);
        return;
      }
      setBooks((prevBooks) => prevBooks.filter((book) => book._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ Edit Click
  const handleEditClick = (book) => {
    setEditId(book._id);
    setEditData(book);
  };

  const handleEditChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Save Edited Book
  const handleSave = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/books/${editId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...editData,
            totalCopies: Number(editData.totalCopies),
            availableCopies: Number(editData.availableCopies),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      // Update UI
      setBooks(books.map((book) => (book._id === editId ? data : book)));

      setEditId(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Books</h2>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Title</th>
            <th className="p-2">Author</th>
            <th className="p-2">Category</th>
            <th className="p-2">Total</th>
            <th className="p-2">Available</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {books.map((book) => (
            <tr key={book._id} className="border-t">
              {editId === book._id ? (
                <>
                  <td className="p-2">
                    <input
                      name="title"
                      value={editData.title}
                      onChange={handleEditChange}
                      className="border p-1"
                    />
                  </td>

                  <td className="p-2">
                    <input
                      name="author"
                      value={editData.author}
                      onChange={handleEditChange}
                      className="border p-1"
                    />
                  </td>

                  <td className="p-2">
                    <input
                      name="category"
                      value={editData.category}
                      onChange={handleEditChange}
                      className="border p-1"
                    />
                  </td>

                  <td className="p-2">
                    <input
                      type="number"
                      name="totalCopies"
                      value={editData.totalCopies}
                      onChange={handleEditChange}
                      className="border p-1 w-20"
                    />
                  </td>

                  <td className="p-2">
                    <input
                      type="number"
                      name="availableCopies"
                      value={editData.availableCopies}
                      onChange={handleEditChange}
                      className="border p-1 w-20"
                    />
                  </td>

                  <td className="p-2 space-x-2">
                    <button
                      onClick={handleSave}
                      className="bg-green-500 text-white px-2 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="bg-gray-500 text-white px-2 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td className="p-2">{book.title}</td>
                  <td className="p-2">{book.author}</td>
                  <td className="p-2">{book.category}</td>
                  <td className="p-2">{book.totalCopies}</td>
                  <td className="p-2">{book.availableCopies}</td>
                  <td className="p-2 space-x-2">
                    <button
                      onClick={() => handleEditClick(book)}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(book._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageBooks;
