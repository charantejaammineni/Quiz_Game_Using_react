import { useEffect, useState } from "react";
import Breadcrumb from "../components/Breadcrumb";

function UserManagement() {
  const defaultUsers = [
  {
    id: 1,
    name: "Rahul",
    email: "rahul@gmail.com",
    role: "User",
    status: "Active",
  },
  {
    id: 2,
    name: "Priya",
    email: "priya@gmail.com",
    role: "User",
    status: "Active",
  },
  {
    id: 3,
    name: "Arjun",
    email: "arjun@gmail.com",
    role: "User",
    status: "Active",
  },
  {
    id: 4,
    name: "Sneha",
    email: "sneha@gmail.com",
    role: "User",
    status: "Active",
  },
  {
    id: 5,
    name: "Admin",
    email: "admin@quizmaster.com",
    role: "Admin",
    status: "Active",
  },
];

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("User");
  const [status, setStatus] = useState("Active");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  // Loads users from localStorage
  useEffect(() => {
    const savedUsers = JSON.parse(
      localStorage.getItem("users") || "[]"
    );

    if (savedUsers.length === 1) {
      localStorage.setItem(
        "users",
        JSON.stringify(defaultUsers)
      );

      setUsers(defaultUsers);
    } else {
      setUsers(savedUsers);
    }
  }, []);

  // Filters users by name or email
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );
  // Reset to page 1 when search or user count changes
useEffect(() => {
  setCurrentPage(1);
}, [search, users.length]);

  // Calculates pagination values
  const totalPages = Math.ceil(
    filteredUsers.length / usersPerPage
  );

  const startIndex = (currentPage - 1) * usersPerPage;

  const currentUsers = filteredUsers.slice(
    startIndex,
    startIndex + usersPerPage
  );

  // Opens the form for editing
  function handleEdit(user) {
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setStatus(user.status);

    setEditId(user.id);
    setShowForm(true);
  }

  // Clears the form
  function resetForm() {
    setName("");
    setEmail("");
    setRole("User");
    setStatus("Active");
    setEditId(null);
    setShowForm(false);
  }

  // Adds or updates a user
  function handleSubmit(event) {
    event.preventDefault();

    const savedUsers = JSON.parse(
      localStorage.getItem("users") || "[]"
    );

    // Update existing user
    if (editId !== null) {
      const updatedUsers = savedUsers.map((user) => {
        if (user.id === editId) {
          return {
            ...user,
            name: name,
            email: email,
            role: role,
            status: status,
          };
        }

        return user;
      });

      localStorage.setItem(
        "users",
        JSON.stringify(updatedUsers)
      );

      setUsers(updatedUsers);

      alert("User updated successfully");
    } else {
      // Create a new user
      const newId =
        savedUsers.length > 0
          ? Math.max(
              ...savedUsers.map((user) => Number(user.id))
            ) + 1
          : 1;

      const newUser = {
        id: newId,
        name: name,
        email: email,
        role: role,
        status: status,
      };

      const updatedUsers = [...savedUsers, newUser];

      localStorage.setItem(
        "users",
        JSON.stringify(updatedUsers)
      );

      setUsers(updatedUsers);

      alert("User added successfully");
    }

    resetForm();
  }

  // Deletes a user 
function handleDelete(id) {
  const updatedUsers = users
    .filter((user) => user.id !== id)
    .map((user, index) => ({
      ...user,
      id: index + 1,
    }));

  setUsers(updatedUsers);

  localStorage.setItem(
    "users",
    JSON.stringify(updatedUsers)
  );
}

  return (
    <div className="admin-page">
      <Breadcrumb/>
      <h1>User Management</h1>

      <p>Manage registered users from this page.</p>

      <div className="admin-toolbar">
        {/* Search users by name or email */}
        <input
          type="text"
          placeholder="Search user..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setCurrentPage(1);
          }}
        />

        {!showForm && (
          <button onClick={() => setShowForm(true)}>
            Add User
          </button>
        )}
      </div>

      {/* Add/Edit user form */}
      {showForm && (
        <form onSubmit={handleSubmit}>
          <h2>
            {editId !== null ? "Edit User" : "Add User"}
          </h2>

          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter name"
            required
          />

          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter email"
            required
          />

          <label>Role</label>
          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>

          <label>Status</label>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <br />
          <br />

          <button type="submit">
            {editId !== null ? "Update User" : "Save User"}
          </button>

          <button
            type="button"
            onClick={resetForm}
          >
            Cancel
          </button>
        </form>
      )}

      {/* User table */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>
              <div className="user-name-cell">
              <div className="user-avatar">
               {user.name.charAt(0).toUpperCase()}
              </div>
              <span>{user.name}</span>
                </div>
              </td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.status}</td>

              <td>
                <button onClick={() => handleEdit(user)}>
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
{totalPages > 1 && (
  <div className="pagination">
    <button
      type="button"
      onClick={() => setCurrentPage(currentPage - 1)}
      disabled={currentPage === 1}
    >
      Previous
    </button>

    {Array.from({ length: totalPages }, (_, index) => {
      const pageNumber = index + 1;

      return (
        <button
          type="button"
          key={pageNumber}
          className={
            currentPage === pageNumber ? "active-page" : ""
          }
          onClick={() => setCurrentPage(pageNumber)}
        >
          {pageNumber}
        </button>
      );
    })}

    <button
      type="button"
      onClick={() => setCurrentPage(currentPage + 1)}
      disabled={currentPage === totalPages}
    >
      Next
    </button>
  </div>
)}

      {filteredUsers.length === 0 && (
        <p>No users found.</p>
      )}
    </div>
  );
}

export default UserManagement;