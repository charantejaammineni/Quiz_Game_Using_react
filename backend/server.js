import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON body parsing
app.use(cors());
app.use(express.json());

// Helper function to resolve JSON file paths
const getFilePath = (fileName) => path.join(__dirname, "data", `${fileName}.json`);

// Helper to read JSON file safely
const readJson = (fileName) => {
  const filePath = getFilePath(fileName);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2));
    return [];
  }
  const fileContent = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(fileContent || "[]");
};

// Helper to write JSON file safely
const writeJson = (fileName, data) => {
  const filePath = getFilePath(fileName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
};

// Health Check
app.get("/", (req, res) => {
  res.send({ status: "ok", message: "QuizMaster API is running" });
});

// ==========================================
// 1. USERS ENDPOINTS
// ==========================================

// GET all users
app.get("/api/users", (req, res) => {
  try {
    const users = readJson("users");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to read users" });
  }
});

// POST register / add new user
app.post("/api/users", (req, res) => {
  try {
    const users = readJson("users");
    const { username, name, email, password, role, status } = req.body;

    const displayName = (name || username || "").trim();
    if (!displayName || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    const emailExists = users.some(
      (u) => (u.email || "").toLowerCase() === email.trim().toLowerCase()
    );
    if (emailExists) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    // Generate sequential ID: 1, 2, 3...
    const numericIds = users.map((u) => Number(u.id)).filter((id) => !isNaN(id));
    const nextId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;

    const newUser = {
      id: String(nextId),
      name: displayName,
      username: displayName,
      email: email.trim().toLowerCase(),
      password,
      role: role || "User",
      status: status || "Active",
    };

    users.push(newUser);
    writeJson("users", users);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to save user" });
  }
});

// PUT update user
app.put("/api/users/:id", (req, res) => {
  try {
    const users = readJson("users");
    const userId = String(req.params.id);
    const index = users.findIndex((u) => String(u.id) === userId);

    if (index === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    const displayName = (req.body.name || req.body.username || users[index].name || "").trim();

    users[index] = {
      ...users[index],
      ...req.body,
      id: userId,
      name: displayName,
      username: displayName,
    };

    writeJson("users", users);
    res.json(users[index]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

// DELETE user
app.delete("/api/users/:id", (req, res) => {
  try {
    const users = readJson("users");
    const userId = String(req.params.id);
    const filteredUsers = users.filter((u) => String(u.id) !== userId);

    if (users.length === filteredUsers.length) {
      return res.status(404).json({ error: "User not found" });
    }

    writeJson("users", filteredUsers);
    res.json({ message: "User deleted successfully", id: userId });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// POST login authentication
app.post("/api/login", (req, res) => {
  try {
    const users = readJson("users");
    const { email, password } = req.body;

    const user = users.find(
      (u) =>
        (u.email || "").toLowerCase() === (email || "").trim().toLowerCase() &&
        u.password === password
    );

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name || user.username,
        username: user.username || user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

// ==========================================
// 2. QUIZZES ENDPOINTS
// ==========================================

// GET all quizzes
app.get("/api/quizzes", (req, res) => {
  try {
    const quizzes = readJson("quizzes");
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: "Failed to read quizzes" });
  }
});

// POST add new quiz
app.post("/api/quizzes", (req, res) => {
  try {
    const quizzes = readJson("quizzes");
    const { name, title, category, level, questions, totalQuestions, timeLimit } = req.body;

    const quizName = (name || title || "").trim();
    if (!quizName || !category) {
      return res.status(400).json({ error: "Quiz name and category are required" });
    }

    const numericIds = quizzes.map((q) => Number(q.id)).filter((id) => !isNaN(id));
    const nextId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;

    const newQuiz = {
      id: String(nextId),
      name: quizName,
      title: quizName,
      category: category.trim(),
      level: level || "Easy",
      questions: Number(questions || totalQuestions) || 0,
      totalQuestions: Number(totalQuestions || questions) || 5,
      timeLimit: Number(timeLimit) || 10,
    };

    quizzes.push(newQuiz);
    writeJson("quizzes", quizzes);
    res.status(201).json(newQuiz);
  } catch (error) {
    res.status(500).json({ error: "Failed to save quiz" });
  }
});

// PUT update quiz
app.put("/api/quizzes/:id", (req, res) => {
  try {
    const quizzes = readJson("quizzes");
    const quizId = String(req.params.id);
    const index = quizzes.findIndex((q) => String(q.id) === quizId);

    if (index === -1) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    const quizName = req.body.name || req.body.title || quizzes[index].name;

    quizzes[index] = {
      ...quizzes[index],
      ...req.body,
      id: quizId,
      name: quizName,
      title: quizName,
    };

    writeJson("quizzes", quizzes);
    res.json(quizzes[index]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update quiz" });
  }
});

// DELETE quiz
app.delete("/api/quizzes/:id", (req, res) => {
  try {
    const quizzes = readJson("quizzes");
    const quizId = String(req.params.id);
    const filtered = quizzes.filter((q) => String(q.id) !== quizId);

    if (quizzes.length === filtered.length) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    writeJson("quizzes", filtered);
    res.json({ message: "Quiz deleted successfully", id: quizId });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete quiz" });
  }
});

// ==========================================
// 3. QUESTIONS ENDPOINTS
// ==========================================

// GET all questions (with optional filters for ?quizId=... or ?category=...)
app.get("/api/questions", (req, res) => {
  try {
    const questions = readJson("questions");
    const { quizId, category } = req.query;

    let filtered = questions;

    if (quizId) {
      filtered = filtered.filter((q) => String(q.quizId) === String(quizId));
    } else if (category) {
      filtered = filtered.filter(
        (q) => (q.category || "").toLowerCase() === category.toLowerCase()
      );
    }

    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: "Failed to read questions" });
  }
});

// POST add new question
app.post("/api/questions", (req, res) => {
  try {
    const questions = readJson("questions");
    const {
      quizId,
      question,
      text,
      options,
      correctAnswer,
      answer,
      category,
    } = req.body;

    const questionText = (question || text || "").trim();
    const finalAnswer = (correctAnswer || answer || "").trim();

    if (!questionText || !Array.isArray(options) || !finalAnswer) {
      return res.status(400).json({ error: "Question text, options, and correctAnswer are required" });
    }

    const numericIds = questions.map((q) => Number(q.id)).filter((id) => !isNaN(id));
    const nextId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;

    const newQuestion = {
      id: nextId,
      quizId: quizId ? String(quizId) : undefined,
      question: questionText,
      text: questionText,
      options: options.map((opt) => String(opt).trim()),
      correctAnswer: finalAnswer,
      answer: finalAnswer,
      category: (category || "General").trim(),
    };

    questions.push(newQuestion);
    writeJson("questions", questions);

    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ error: "Failed to save question" });
  }
});

// PUT update question
app.put("/api/questions/:id", (req, res) => {
  try {
    const questions = readJson("questions");
    const qId = req.params.id;
    const index = questions.findIndex((q) => String(q.id) === String(qId));

    if (index === -1) {
      return res.status(404).json({ error: "Question not found" });
    }

    const questionText = req.body.question || req.body.text || questions[index].question;
    const finalAnswer = req.body.correctAnswer || req.body.answer || questions[index].correctAnswer;

    questions[index] = {
      ...questions[index],
      ...req.body,
      id: questions[index].id,
      question: questionText,
      text: questionText,
      correctAnswer: finalAnswer,
      answer: finalAnswer,
    };

    writeJson("questions", questions);
    res.json(questions[index]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update question" });
  }
});

// DELETE question
app.delete("/api/questions/:id", (req, res) => {
  try {
    const questions = readJson("questions");
    const qId = req.params.id;
    const filtered = questions.filter((q) => String(q.id) !== String(qId));

    if (questions.length === filtered.length) {
      return res.status(404).json({ error: "Question not found" });
    }

    writeJson("questions", filtered);
    res.json({ message: "Question deleted successfully", id: qId });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete question" });
  }
});

// ==========================================
// 4. RESULTS & ATTEMPTS ENDPOINTS
// ==========================================

// GET results
app.get("/api/results", (req, res) => {
  try {
    const results = readJson("results");
    const { userId } = req.query;

    if (userId) {
      const userResults = results.filter((r) => String(r.userId) === String(userId));
      return res.json(userResults);
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "Failed to read results" });
  }
});

// POST save quiz attempt
app.post("/api/results", (req, res) => {
  try {
    const results = readJson("results");
    const { userId, username, quizId, quizTitle, category, score, totalQuestions, date } = req.body;

    const numericIds = results.map((r) => Number(r.id)).filter((id) => !isNaN(id));
    const nextId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;

    const newResult = {
      id: String(nextId),
      userId: userId || "guest",
      username: username || "Guest User",
      quizId: quizId || "unknown",
      quizTitle: quizTitle || "Quiz Attempt",
      category: category || "General",
      score: Number(score) || 0,
      totalQuestions: Number(totalQuestions) || 5,
      date: date || new Date().toISOString().split("T")[0],
    };

    results.push(newResult);
    writeJson("results", results);
    res.status(201).json(newResult);
  } catch (error) {
    res.status(500).json({ error: "Failed to save quiz result" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`QuizMaster Server running at http://localhost:${PORT}`);
});