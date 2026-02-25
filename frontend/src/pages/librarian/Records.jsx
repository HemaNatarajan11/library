import React, { useEffect, useState } from "react";

const Records = () => {
  const [records, setRecords] = useState([]);

  const token = localStorage.getItem("token");

  // ✅ Fetch all borrow records
  useEffect(() => {
    const fetchRecords = async () => {
      if (!token) return;

      try {
        const response = await fetch("http://localhost:5000/api/borrow", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          console.error("Failed to fetch records");
          return;
        }

        const data = await response.json();
        console.log("API response:", JSON.stringify(data[0], null, 2)); // ← add this line

        setRecords(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRecords();
  }, [token]);

  const today = new Date();

  const getStatus = (record) => {
    if (record.status === "returned") return "Returned";
    if (record.status === "issued" && new Date(record.dueDate) < today)
      return "Overdue";
    return "Issued";
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Issue / Return Records</h2>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Student</th>
            <th className="p-2">Book</th>
            <th className="p-2">Issue Date</th>
            <th className="p-2">Due Date</th>
            <th className="p-2">Status</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {records.map((record) => (
            <tr key={record._id} className="border-t">
              <td className="p-2">{record.student?.username || "N/A"}</td>
              <td className="p-2">{record.book?.title || "N/A"}</td>
              <td className="p-2">
                {new Date(record.issueDate).toLocaleDateString()}
              </td>
              <td className="p-2">
                {new Date(record.dueDate).toLocaleDateString()}
              </td>
              <td
                className={`p-2 font-semibold ${
                  getStatus(record) === "Overdue"
                    ? "text-red-600"
                    : getStatus(record) === "Returned"
                      ? "text-green-600"
                      : "text-blue-600"
                }`}
              >
                {getStatus(record)}
              </td>
              <td className="p-2">
                {getStatus(record) === "Returned"
                  ? "Returned"
                  : "Pending Return"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Records;
