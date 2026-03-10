import React, { useState } from "react";
import { useApp } from "../../context/AppContext.jsx";

const EditProfilePage = () => {
  const { user } = useApp();
  const [name, setName] = useState(user?.name || "");
  const [city, setCity] = useState(user?.city || "");

  return (
    <div className="page-body">
      <div className="page-header">
        <h1>Edit profile</h1>
        <p>Update your basic information.</p>
      </div>
      <div className="card">
        <div className="form-group">
          <label className="form-label">Name</label>
          <input
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
        </div>
        <div className="form-group">
          <label className="form-label">City</label>
          <input
            className="form-input"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
          />
        </div>
        <button className="btn btn-primary" type="button" disabled>
          Save (wire to API later)
        </button>
      </div>
    </div>
  );
};

export default EditProfilePage;

