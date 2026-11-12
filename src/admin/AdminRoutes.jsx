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
      <Route path="signin" element={<AdminLogin />} />

      {/* All other admin pages require login */}
      <Route element={<AdminAuth />}>
        <Route index element={<AdminHome />} />
        <Route path="quizzes" element={<AdminQuizzes />} />
        <Route path="quizzes/add" element={<AddQuiz />} />
        <Route
          path="quizzes/:quizId/questions"
          element={<QuestionManagement />}
        />
        <Route path="users" element={<UserManagement />} />
        <Route path="results" element={<Results />} />
        <Route path="reports" element={<Reports />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="quizzes/:quizId/details" element={<QuizDetails />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="questions/upload" element={<UploadQuestions />} />
      </Route>
    </Routes>
  );
}

export default AdminRoutes;