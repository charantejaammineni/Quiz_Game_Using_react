import { Routes, Route } from "react-router-dom";

import UserHome from "./UserHome";
import Quiz from "./Quiz";
import Result from "./Result";
import SignIn from "./SignIn";
import Register from "./Register";
import Leaderboard from "./LeaderBoard";
import Profile from "./Profile";
import History from "./History";
import UserAuth from "./UserAuth";
import ChooseQuiz from "./Choosequiz";

function UserRoutes() {
  return (
    <Routes>
      {/* Public pages */}
      <Route index element={<UserHome />} />
      <Route path="signin" element={<SignIn />} />
      <Route path="register" element={<Register />} />

      {/* Pages requiring user login */}
      <Route element={<UserAuth />}>
        <Route path="quiz" element={<Quiz />} />
        <Route path="result" element={<Result />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="history" element={<History />} />
        <Route path="quizzes" element={<ChooseQuiz />} />
      </Route>
    </Routes>
  );
}

export default UserRoutes;