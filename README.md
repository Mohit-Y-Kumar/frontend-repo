Login Frontend (React + Vite + Tailwind CSS)
Project Overview

This is the frontend of the project. It provides a responsive login and signup interface with OTP-based authentication. Built with ReactJS, Vite, and Tailwind CSS, it communicates with the Node.js backend via RESTful APIs.
## Technology Stack

 Frontend Framework: ReactJS (Vite)

 Styling: Tailwind CSS

 State Management: React Hooks, Context API

 Forms & Validation: react-hook-form

 Icons: lucide-react

 Version Control: Git

 Deployment: Can be deployed on Vercel


## Folder Structure
 frontend/
│
├─ src/
│   ├─ api/                 # Axios instance for API calls
│   │   └─ api.js           # API configuration
│   ├─ assets/              # Images and icons
│   ├─ components/          # Reusable components
│   │   ├─ OtpInput.jsx     # OTP input component
│   │   └─ Clock.jsx        # Real-time clock component
│   ├─ pages/
│   │   ├─ Login.jsx        # Login page with OTP authentication
│   │   ├─ Signup.jsx       # Signup page
│   │   ├─ Dashboard.jsx    # User dashboard page
│   │   └─ OAuthSuccess.jsx # OAuth login success page
│   ├─ App.jsx              # Main app component
│   ├─ main.jsx             # Entry point for Vite
│   ├─ index.css            # Global styles
│   └─ App.css              # Component-specific styles
│
├─ public/                  # Public assets
├─ package.json
├─ package-lock.json
├─ vite.config.js
└─ README.md

## Features

 Authentication

 Login with email and OTP

 Signup with Google

 Signup with email validation

 “Keep me logged in” option

 Responsive Design

 Mobile-first layout

 Dynamic mobile header with time, battery, and Wi-Fi icons

 Real-time Clock Component

 Displays live time on mobile header

 Reusable Components

# OtpInput.jsx for OTP entry

# Clock.jsx for live time display

# API Integration

# Communicates with backend APIs for authentication and user data

# Form Validation

# Client-side validation using react-hook-form

# Installation & Setup

# Clone the repository

git clone (https://github.com/Mohit-Y-Kumar/frontend-repo.git)
cd frontend


# Install dependencies

 npm install


# Configure API URL

 Open src/api/api.js and set the backend API base URL:

 import axios from "axios";

# 
 const API = axios.create({
  baseURL: "http://localhost:5000", // Replace with your backend URL
  });

 export default API;


# Run the development server

npm run dev


The frontend will run on http://localhost:5173 (or as shown in the terminal).