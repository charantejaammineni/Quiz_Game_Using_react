
@echo off
title QuizMaster - React Project

cd /d "C:\Users\LENOVO\Desktop\React\Quizmaster"

echo ==============================
echo       Starting QuizMaster
echo ==============================
echo.

if not exist "node_modules" (
    echo Installing project dependencies...
    call npm install
)

echo Starting React development server...
echo.

call npm run dev

pause
