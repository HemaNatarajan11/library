import React, { useEffect, useState } from "react";

const LibDashboard = () => {
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [borrows, setBorrows] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const booksRes = await fetch(
          "https://librarydigi.onrender.com/api/books",
          {
            headers,
          },
        );
        const booksData = await booksRes.json();

        const usersRes = await fetch(
          "https://librarydigi.onrender.com/api/users",
          {
            headers,
          },
        );
        const usersData = await usersRes.json();

        const borrowRes = await fetch(
          "https://librarydigi.onrender.com/api/borrow",
          {
            headers,
          },
        );
        const borrowData = await borrowRes.json();

        setBooks(booksData);
        setUsers(usersData);
        setBorrows(borrowData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [token]);

  const totalBooks = books.length;

  const totalAuthors = [...new Set(books.map((book) => book.author))].length;

  const totalStudents = users.filter((user) => user.role === "student").length;

  const borrowedBooks = borrows.filter((book) => !book.returnDate).length;

  const availableBooks = books.reduce(
    (total, book) => total + (Number(book.availableCopies) || 0),
    0,
  );

  const today = new Date();
  const overdueBooks = borrows.filter(
    (book) => !book.returnDate && new Date(book.dueDate) < today,
  ).length;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Librarian Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-100 p-4 rounded shadow">
          <h3>Total Books</h3>
          <p className="text-2xl">{totalBooks}</p>
        </div>

        <div className="bg-green-100 p-4 rounded shadow">
          <h3>Total Authors</h3>
          <p className="text-2xl">{totalAuthors}</p>
        </div>

        <div className="bg-purple-100 p-4 rounded shadow">
          <h3>Registered Students</h3>
          <p className="text-2xl">{totalStudents}</p>
        </div>

        <div className="bg-yellow-100 p-4 rounded shadow">
          <h3>Borrowed Books</h3>
          <p className="text-2xl">{borrowedBooks}</p>
        </div>

        <div className="bg-indigo-100 p-4 rounded shadow">
          <h3>Available Books</h3>
          <p className="text-2xl">{availableBooks}</p>
        </div>

        <div className="bg-red-100 p-4 rounded shadow">
          <h3>Overdue Books</h3>
          <p className="text-2xl">{overdueBooks}</p>
        </div>
      </div>
    </div>
  );
};

export default LibDashboard;
