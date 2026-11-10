import React, { useEffect, useState } from "react";
import Breadcrumb from "../components/Breadcrumb";

const USERS_API = "http://localhost:5000/api/users";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");
  const [status, setStatus] = useState("Active");

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  // 1. Fetch users from backend API
  const fetchUsers = async () => {
    try {
      const response = await fetch(USERS_API);
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. Hide admin users and apply search query
  const filteredUsers = users
    .filter((user) => (user.role || "").toLowerCase() !== "admin")
    .filter(
      (user) =>
        (user.name || user.username || "").toLowerCase().includes(search.toLowerCase()) ||
        (user.email || "").toLowerCase().includes(search.toLowerCase())
    );

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Reset form inputs
  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setRole("User");
    setStatus("Active");
    setEditId(null);
    setShowForm(false);
  };

  // Add or Edit User
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim() || !email.trim()) {
      alert("Please fill in all required fields!");
      return;
    }

    const userPayload = {
      name: name.trim(),
      username: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      status,
    };

    if (password) {
      userPayload.password = password;
    }

    try {
      if (editId !== null) {
        const response = await fetch(`${USERS_API}/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userPayload),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Failed to update user");
        }

        const updatedUser = await response.json();
        setUsers(
          users.map((u) => (String(u.id) === String(editId) ? updatedUser : u))
        );
        alert("User updated successfully!");
      } else {
        const response = await fetch(USERS_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...userPayload, password: password || "user123" }),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Failed to add user");
        }

        const savedUser = await response.json();
        setUsers([...users, savedUser]);
        alert("User added successfully!");
      }

      resetForm();
    } catch (error) {
      alert(error.message);
    }
  };

  // Populate form for editing
  const handleEdit = (user) => {
    setEditId(user.id);
    setName(user.name || user.username || "");
    setEmail(user.email || "");
    setPassword(user.password || "");
    setRole(user.role || "User");
    setStatus(user.status || "Active");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Delete User
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${USERS_API}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to delete user");
      }

      setUsers(users.filter((u) => String(u.id) !== String(id)));
      alert("User deleted successfully!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="user-management">
      <Breadcrumb />

      <div className="user-header">
        <div>
          <h2>User Management</h2>
          <p>Manage all registered users here.</p>
        </div>

        <button
          className="add-user-btn"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          + Add User
        </button>
      </div>

      {showForm && (
        <div className="user-form-container">
          <h3>{editId !== null ? "Edit User" : "Add New User"}</h3>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="form-buttons">
              <button type="submit" className="save-btn">
                {editId !== null ? "Update User" : "Add User"}
              </button>

              <button type="button" className="cancel-btn" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search Bar */}
      <div className="user-search">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Table displaying regular users only */}
      <div className="user-table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map((user, index) => (
                <tr key={user.id}>
                  <td>{indexOfFirstUser + index + 1}</td>
                  <td>{user.name || user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <span
                      className={`status-badge ${(user.status || "Active").toLowerCase()}`}
                    >
                      {user.status || "Active"}
                    </span>
                  </td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(user)}>
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(user.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-users">
                  No registered users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default UserManagement;