import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const onLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) return null;
  return (
    <>
      <nav className="bg-blue-300 text-white px-6 py-6 flex justify-between items-center">
        <h1 className="text-xl font-bold gap-5">Library System</h1>

        <div className="space-x-4">
          {user?.role === "librarian" && (
            <>
              <Link to="/librarian/libdashboard">Dashboard</Link>
              <Link to="/librarian/add-book">Add Book</Link>
              <Link to="/librarian/manage-books">Manage Books</Link>
              <Link to="/librarian/records">Records</Link>
            </>
          )}
          {/* Student Links */}
          {user?.role === "student" && (
            <>
              <Link to="/student/dashboard">Home</Link>
              <Link to="/student/search">Search Books</Link>
              <Link to="/student/mybooks">My Books</Link>
            </>
          )}

          {user && (
            <button onClick={onLogout} className="bg-red-500 px-3 py-1 rounded">
              Logout
            </button>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
