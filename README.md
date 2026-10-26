# QuizMaster – Online Quiz Application

QuizMaster is a web-based quiz application developed using React.js. It allows users to take quizzes, test their knowledge, view their scores, and track their quiz history. It also provides an admin portal to manage quizzes, questions, and users.

## Features

### User Portal
- User registration and sign-in
- View and select available quizzes
- Answer multiple-choice questions
- Calculate quiz scores and display results
- View quiz history
- View leaderboard rankings
- Manage user profile

### Admin Portal
- Admin sign-in
- Create and manage quizzes
- Add, edit, and delete quiz questions
- Manage users
- View quiz results and reports
- Access admin dashboard and other management pages

## Technologies Used

- **Frontend:** React.js, JavaScript, HTML5, CSS3
- **Routing:** React Router
- **Data Storage:** Browser `localStorage` and `sessionStorage`
- **Question Data:** XML
- **Development Tool:** Vite
- **Version Control:** Git and GitHub

## Project Structure

```text
Quizmaster/
├── public/
│   └── data/
│       └── questions.xml
├── src/
│   ├── admin/
│   ├── components/
│   ├── data/
│   ├── user/
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## Getting Started

### Prerequisites
- Node.js
- npm
- Git

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/charantejaammineni/Quiz_Game_Using_react.git
   ```

2. Navigate to the project folder:

   ```bash
   cd Quiz_Game_Using_react
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL displayed in the terminal in your browser.

## Data Storage

QuizMaster uses browser storage to save application data such as user information, quiz details, questions managed through the admin portal, and quiz results. XML is used to provide the initial quiz question data.

**Note:** Browser storage is local to the website and browser. This project does not currently use a centralized backend database.

## Learning Outcomes

This project helped me practice:
- Building reusable React components
- Managing component state and side effects
- Implementing navigation with React Router
- Handling forms and user interactions
- Working with XML and browser storage
- Using Git and GitHub for version control
