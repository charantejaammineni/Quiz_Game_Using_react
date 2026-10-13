
import { Routes, Route } from "react-router-dom";

import AdminHome from "./AdminHome";
import AdminQuizzes from "./AdminQuizzes";
import AddQuiz from "./AddQuiz";
import QuestionManagement from "./QuestionManagement";
import UserManagement from "./UserManagement";
import Results from "./Results";
import Reports from "./Reports";
import AdminProfile from "./AdminProfile";
import AdminSettings from "./AdminSettings";
import QuizDetails from "./QuizDetails";
import AdminNotifications from "./AdminNotifications";
import Calendar from "./Calendar";
import UploadQuestions from "./UploadQuestions";
import AdminLogin from "./AdminLogin";
import AdminAuth from "./AdminAuth";

function AdminRoutes() {
  return (
    <Routes>
      {/* Login page - accessible without authentication */}
      <Route path="/admin/signin" element={<AdminLogin />} />

      {/* All other admin pages require login */}
      <Route element={<AdminAuth />}>
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/admin/quizzes" element={<AdminQuizzes />} />
        <Route path="/admin/quizzes/add" element={<AddQuiz />} />
        <Route
          path="/admin/quizzes/:quizId/questions"
          element={<QuestionManagement />}
        />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/results" element={<Results />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route
          path="/admin/quizzes/:quizId/details"
          element={<QuizDetails />}
        />
        <Route
          path="/admin/notifications"
          element={<AdminNotifications />}
        />
        <Route path="/admin/calendar" element={<Calendar />} />
        <Route
          path="/admin/questions/upload"
          element={<UploadQuestions />}
        />
      </Route>
    </Routes>
  );
}

export default AdminRoutes;
