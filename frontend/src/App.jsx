import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";

//student pages
import Dashboard from "./pages/student/Dashboard";
import MyBooks from "./pages/student/MyBooks";
import SearchBooks from "./pages/student/SearchBooks";

//librarian pages
import LibDashboard from "./pages/librarian/LibDashboard";
import AddBook from "./pages/librarian/AddBook";
import ManageBooks from "./pages/librarian/ManageBooks";
import Records from "./pages/librarian/Records";

function App() {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/" || location.pathname === "/register";
  return (
    <>
      {" "}
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/student/dashboard" element={<Dashboard />} />
        <Route path="/student/mybooks" element={<MyBooks />} />
        <Route path="/student/search" element={<SearchBooks />} />

        <Route path="/librarian/libdashboard" element={<LibDashboard />} />
        <Route path="/librarian/add-book" element={<AddBook />} />
        <Route path="/librarian/manage-books" element={<ManageBooks />} />
        <Route path="/librarian/records" element={<Records />} />
      </Routes>
    </>
  );
}

export default App;
