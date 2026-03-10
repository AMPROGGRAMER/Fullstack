import React, { useEffect, useState } from "react";
import { fetchAdminUsers } from "../../services/adminService.js";
import { useApp } from "../../context/AppContext.jsx";

const ManageUsersPage = () => {
  const { user } = useApp();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchAdminUsers();
        setUsers(data);
      } catch {
        setUsers([]);
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
        <h1>Manage users</h1>
        <p>Inspect all registered users.</p>
      </div>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsersPage;

