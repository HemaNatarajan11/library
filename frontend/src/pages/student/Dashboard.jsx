import React, { useState, useEffect } from "react";
import { BookOpen, AlertCircle, History } from "lucide-react";

const Dashboard = () => {
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
          console.log(data.message);
          return;
        }
        setMyBooks(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMyBooks();
  }, []);

  const today = new Date();

  const borrowedCount = myBooks.filter((b) => b.status === "issued").length;

  const overdueCount = myBooks.filter(
    (b) => b.status === "issued" && new Date(b.dueDate) < today,
  ).length;

  return (
    <div
      className="h-screen bg-cover bg-center bg-no-repeat relative overflow-hidden "
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66')",
      }}
    >
      <div className="absolute inset-0 bg-black/40 "></div>

      <div className="relative z-10 p-8">
        <h1 className="text-4xl font-bold text-amber-50">
          Welcome back,{" "}
          <span className="text-indigo-600">{currentUser?.username}</span>
        </h1>
        <p className="mt-3 text-amber-50 text-lg">
          "Today a reader, tomorrow a leader."
        </p>
      </div>

      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <div className="bg-white p-8 rounded-3xl shadow-lg hover:scale-105 transition duration-300">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-600 text-lg">Borrowed Books</h3>
            <BookOpen className="text-indigo-500" />
          </div>
          <p className="text-4xl font-bold text-indigo-600 mt-4">
            {borrowedCount}
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-lg hover:scale-105 transition duration-300">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-600 text-lg">Overdue Books</h3>
            <AlertCircle className="text-red-500" />
          </div>
          <p className="text-4xl font-bold text-red-500 mt-4">{overdueCount}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-lg hover:scale-105 transition duration-300">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-600 text-lg">Reading History</h3>
            <History className="text-green-500" />
          </div>
          <p className="text-4xl font-bold text-green-500 mt-4">
            {myBooks.length}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-lg">
          <h2 className="text-2xl font-semibold text-indigo-600 mb-4">
            📚 Why Reading Matters
          </h2>
          <ul className="space-y-3 text-gray-700 text-lg">
            <li>• Expands knowledge and perspective</li>
            <li>• Boosts memory and focus</li>
            <li>• Improves vocabulary & communication</li>
            <li>• Enhances creativity</li>
            <li>• Reduces stress & improves mental clarity</li>
          </ul>
        </div>

        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-8 rounded-3xl shadow-xl flex items-center justify-center text-center">
          <p className="text-2xl font-semibold leading-relaxed">
            “A room without books is like a body without a soul.”
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
