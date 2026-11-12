import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import LockBackNavigation from "./components/LockBackNavigation";
import SessionTimeout from "./components/SessionTimeout";
import UserRoutes from "./user/UserRoutes";
import AdminRoutes from "./admin/AdminRoutes";
import LogoutMessage from "./components/LogoutMessage";

function App() {
  return (
    <BrowserRouter>
      <LockBackNavigation />
      <SessionTimeout />
      <LogoutMessage />
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to="/user" replace />} />
        <Route path="/user/*" element={<UserRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="*" element={<Navigate to="/user" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;