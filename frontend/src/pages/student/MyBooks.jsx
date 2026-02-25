import React, { useEffect, useState } from "react";

const MyBooks = () => {
  const [myBooks, setMyBooks] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchMyBooks = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));

        setCurrentUser(user);

        const response = await fetch(
          "http://localhost:5000/api/borrow/mybooks",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await response.json();

        if (!response.ok) {
          alert(data.message);
          return;
        }
        setMyBooks(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchMyBooks();
  }, []);

  const today = new Date();

  // ✅ Calculate fine (₹5 per day late)
  const calculateFine = (dueDate) => {
    const due = new Date(dueDate);
    if (today <= due) return 0;

    const diffTime = today - due;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays * 5;
  };

  const handleReturn = async (borrowId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/borrow/return/${borrowId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }
      alert("Book returned successfully");

      setMyBooks((prev) =>
        prev.map((b) =>
          b._id === borrowId ? { ...b, status: "returned" } : b,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        My Books - {currentUser?.username}
      </h2>

      {myBooks.length === 0 ? (
        <p className="text-gray-500">No books issued yet.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Book</th>
              <th className="p-2">Issue Date</th>
              <th className="p-2">Due Date</th>
              <th className="p-2">Status</th>
              <th className="p-2">Fine</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {myBooks.map((book) => {
              const isOverdue =
                book.status === "issued" && new Date(book.dueDate) < today;

              const fine = calculateFine(book.dueDate);

              return (
                <tr key={book._id} className="border-t">
                  <td className="p-2">{book.book.title}</td>
                  <td className="p-2">
                    {new Date(book.issueDate).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </td>

                  <td className="p-2">
                    {new Date(book.dueDate).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </td>

                  <td
                    className={`p-2 font-semibold ${
                      book.status === "returned"
                        ? "text-green-600"
                        : isOverdue
                          ? "text-red-600"
                          : "text-blue-600"
                    }`}
                  >
                    {book.status}
                  </td>

                  <td className="p-2">{isOverdue ? `₹${fine}` : "-"}</td>

                  <td className="p-2">
                    {book.status === "issued" && (
                      <button
                        onClick={() => handleReturn(book._id)}
                        className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                      >
                        Return
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyBooks;
