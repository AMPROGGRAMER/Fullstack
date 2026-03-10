import React, { useEffect, useState } from "react";
import { fetchAdminProviders } from "../../services/adminService.js";
import { useApp } from "../../context/AppContext.jsx";

const ManageProvidersPage = () => {
  const { user } = useApp();
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchAdminProviders();
        setProviders(data);
      } catch {
        setProviders([]);
      }
    };
    if (user?.role === "admin") load();
  }, [user]);

  if (!user || user.role !== "admin") {
    return (
      <div className="page-body">
        <div className="empty-state">
          <div className="empty-icon">🔐</div>
          <h3>Admin only</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="page-body">
      <div className="page-header">
        <h1>Manage providers</h1>
        <p>View all provider profiles.</p>
      </div>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>City</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {providers.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{p.city}</td>
                <td>{Number(p.rating || 0).toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageProvidersPage;

