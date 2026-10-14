// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import UserHome from "./user/UserHome";
// import AdminHome from "./admin/AdminHome";
// import Navbar from "./components/Navbar";
// import Quiz from "./user/Quiz";
// import Result from "./user/Result";
// import SignIn from "./user/SignIn";
// import Register from "./user/Register";
// import Leaderboard from "./user/LeaderBoard";
// import Profile from "./user/Profile";
// import History from "./user/History";
// import AdminQuizzes from "./admin/AdminQuizzes";

// function App() {
//   return (
//     <BrowserRouter>
//     <Navbar/>
//       <Routes>
//         {/* User Portal */}
//         <Route path="/user" element={<UserHome />} />
//         {/* Admin Portal */}
//         <Route path="/admin" element={<AdminHome />} />
//         {/* User Quiz page */}
//         <Route path="/user/quiz" element={<Quiz />} />
//         {/*  Result page */}
//         <Route path="/user/result" element={<Result />} />
//         {/* User Sign In */}
//         <Route path="/user/signin" element={<SignIn />} />
//         {/* User Register */}
//         <Route path="/user/register" element={<Register/>}/>
//         {/* LeaderBoard */}
//         <Route path="/user/leaderboard" element={<Leaderboard/>}/>
//         {/* User profile */}
//         <Route path="/user/profile" element={<Profile/>}/>
//         {/* User History */}
//         <Route path="/user/history" element={<History/>}/>
//         {/* Admin Portal */}
//         <Route path="/admin" element={<AdminHome />} />
//         {/* Admin Quiz Management */}
//         <Route path="/admin/quizzes" element={<AdminQuizzes />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;


import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import UserRoutes from "./user/UserRoutes";
import AdminRoutes from "./admin/AdminRoutes";

function App() {
  return (
    <BrowserRouter>
      <Navbar/>

      <Routes>
        <Route path="/" element={<Navigate to="/user" replace />} />
      </Routes>

      <UserRoutes />
      <AdminRoutes />
    </BrowserRouter>
  );
}

export default App;
