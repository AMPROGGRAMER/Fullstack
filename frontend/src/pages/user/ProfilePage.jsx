import React from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext.jsx";

const ProfilePage = () => {
  const { user } = useApp();

  if (!user) {
    return (
      <div className="page-body">
        <div className="empty-state">
          <div className="empty-icon">🔐</div>
          <h3>Please login</h3>
          <p>Login to manage your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-body">
      <div className="page-header">
        <h1>Profile</h1>
        <p>Manage your personal details and preferences.</p>
      </div>

      <div className="card">
        <div className="flex items-center gap-4">
          <div className="avatar xl">{user.name[0].toUpperCase()}</div>
          <div>
            <div className="text-xl font-bold">{user.name}</div>
            <div className="text-muted mt-1">{user.email}</div>
            <div className="text-sm mt-1">Role: {user.role}</div>
          </div>
        </div>

        <div className="mt-4">
          <Link className="btn btn-primary btn-sm" to="/profile/edit">
            Edit profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

