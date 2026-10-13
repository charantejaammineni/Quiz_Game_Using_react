
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
      <Route path="/user" element={<UserHome />} />
      <Route path="/user/quiz" element={<Quiz />} />
      <Route path="/user/result" element={<Result />} />
      <Route path="/user/signin" element={<SignIn />} />
      <Route path="/user/register" element={<Register />} />
      <Route path="/user/leaderboard" element={<Leaderboard />} />

      {/* Pages requiring user login */}
      <Route element={<UserAuth />}>
        <Route path="/user/profile" element={<Profile />} />
        <Route path="/user/history" element={<History />} />
        <Route path="/user/quizzes" element={<ChooseQuiz />} />
      </Route>
    </Routes>
  );
}

export default UserRoutes;
