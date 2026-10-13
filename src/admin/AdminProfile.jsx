import Breadcrumb from "../components/Breadcrumb";
function AdminProfile() {
  return (
    <div className="admin-page">
        <Breadcrumb/>
      <h1>Admin Profile</h1>

      <p>View and manage admin profile information.</p>

      <div className="profile-card">
        <div className="profile-avatar">
          A
        </div>

        <h2>QuizMaster Admin</h2>
        <p>Email: admin@quizmaster.com</p>
        <p>Role: Administrator</p>
        <p>Status: Active</p>

        <button>Edit Profile</button>
      </div>
    </div>
  );
}

export default AdminProfile;