import { useNavigate } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";

function AdminProfile() {
  const navigate = useNavigate();
  let admin = null;
  try {
    admin = JSON.parse(sessionStorage.getItem("adminUser"));
  } catch {
    admin = null;
  }

  const adminName = admin?.name || admin?.username || "QuizMaster Admin";
  const adminEmail = admin?.email || "admin@quizmaster.com";

  return (
    <div className="admin-page">
        <Breadcrumb/>
      <h1>Admin Profile</h1>

      <p>View and manage admin profile information.</p>

      <div className="profile-card">
        <div className="profile-avatar">
          {adminName.charAt(0).toUpperCase()}
        </div>

        <h2>{adminName}</h2>
        <p>Email: {adminEmail}</p>
        <p>Role: Administrator</p>
        <p>Status: Active</p>

        <button type="button" onClick={() => navigate("/admin/settings")}>
          Edit Settings
        </button>
      </div>
    </div>
  );
}

export default AdminProfile;