# QuizMaster

A full-stack quiz web application built with **React (Vite)** and a **Node.js/Express** persistent JSON backend.

---

## Features

### User

* User registration and login with session management.
* Browse quizzes by category (`Java`, `SQL`, `IT Basics`, or custom).
* Interactive multiple-choice quiz runner with real-time scoring.
* Back-button navigation protection on completed exams.
* Score summary, personal quiz history, and profile statistics.
* Global leaderboard based on accuracy and scores.

### Admin

* Admin authentication dashboard.
* Create, edit, and delete quizzes with automated IDs.
* Add, edit, and delete questions linked strictly by `quizId`.
* Monitor registered users and account statuses.
* Live results table with search and delete options.
* Performance reports and analytics.
* Breadcrumb navigation across all admin views.

---

## Tech Stack

* **Frontend:** React, React Router v6, Vite, CSS
* **Backend:** Node.js, Express, CORS
* **Storage:** JSON Database (`backend/data/`)

---

## Project Structure

```text
Quizmaster/
├── backend/
│   ├── data/
│   │   ├── questions.json
│   │   ├── quizzes.json
│   │   ├── results.json
│   │   └── users.json
│   ├── package.json
│   └── server.js
├── src/
│   ├── admin/
│   ├── components/
│   ├── user/
│   ├── App.css
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── vite.config.js

```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/charantejaammineni/Quiz_Game_Using_react.git
cd Quiz_Game_Using_react

```

### 2. Run the Backend API

```bash
cd backend
npm install
node server.js

```

Runs at: **`http://localhost:5000`**

### 3. Run the Frontend (in a new terminal)

```bash
npm install
npm run dev

```

Runs at: **`http://localhost:5173`**

---

## API Endpoints

| Endpoint | Methods | Description |
| --- | --- | --- |
| `/api/quizzes` | `GET`, `POST` | Get all quizzes or create a quiz |
| `/api/quizzes/:id` | `PUT`, `DELETE` | Update or delete a quiz |
| `/api/questions` | `GET`, `POST` | Get questions or add questions by `quizId` |
| `/api/questions/:id` | `PUT`, `DELETE` | Update or delete a question |
| `/api/users` | `GET`, `POST` | Get all users or register a new user |
| `/api/results` | `GET`, `POST` | Fetch quiz submissions or save a new result |
| `/api/results/:id` | `DELETE` | Delete a quiz attempt |

---

## Default Login Credentials

* **Admin Email:** `admin@quizmaster.com`
* **Admin Password:** `Admin@123`
* **User:** Register via the Sign-Up page or use existing accounts from `backend/data/users.json`.
