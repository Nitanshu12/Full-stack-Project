🚀 CollabSphere — A Student Collaboration & Mentorship Platform

CollabSphere is a full–stack web platform designed to help students find teammates, connect with mentors, collaborate on projects, and build innovation-driven communities.
It solves the common problem of scattered opportunities by providing a unified hub where:

Students can find like-minded collaborators

Mentors can guide and support learning

Project teams can showcase ideas

Users can request to join, accept, reject, and communicate

Everyone can explore trending skills, projects, and talent

This platform is built as a capstone project with full-stack engineering principles, JWT authentication, OAuth, secure cookies, scalable backend APIs, and a modular React frontend.

🌐 Live Links
🔵 Frontend (Vercel Deployment)
https://collabsphere-five.vercel.app

🔴 Backend (Render Deployment)
https://collabsphere-backend-0np0.onrender.com/api

🟢 Database (MongoDB Atlas Cluster)
Cluster Name: CollabSphere123
Database: test
Collections: users, projects, posts

🏗️ Tech Stack
Frontend

React (Vite)

React Router

Axios (with refresh-token interceptor)

Tailwind CSS + Custom Styling

Context API for authentication

Protected Routes

Backend

Node.js + Express.js

MongoDB Atlas + Mongoose

JWT Authentication

Access Token + Refresh Token Cycle

Google OAuth Integration

CORS + Secure Cookies

REST API Architecture

Hosting
Layer	Platform
Frontend	Vercel
Backend	Render
Database	MongoDB Atlas
🧠 Core Features
🔑 Authentication & Authorization

Email/Password Sign Up

Email/Password Login

Google OAuth Login

JWT Access Token + Refresh Token Logic

Session auto-renewal

Protected routes based on user role (Student / Mentor / Organization)

👤 User Profiles

Name, Bio, Skills, Role

Profile Picture (future enhancement)

Update Profile Feature

📢 Project Collaboration System

Create project idea

Add skills required

Add collaborators

Send join requests

Accept / Reject flow

Track member status

🔍 Smart Search & Explore

Search users by skill

Search projects by domain

Filter, Sort, Pagination

Recommended collaborators (future upgrade)

🤝 Collaboration Requests

Real-time requests

Accept / Reject notifications

Stored request status in database

📰 Community Feed (Phase 2)

Students can post updates

Discuss ideas

Engage with other creators

🔧 API Endpoints (Important Routes)
Auth Routes
POST   /api/auth/signup
POST   /api/auth/signin
POST   /api/auth/refresh-token
GET    /api/auth/user-details
GET    /api/auth/logout

Google OAuth
GET    /api/auth/google
GET    /api/auth/google/callback

Users
GET    /api/auth/all-user

Projects
POST   /api/project/create
GET    /api/project/all
POST   /api/project/request-join
POST   /api/project/request-response

📂 Project Folder Structure
collabsphere/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/db.js
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── context/
│   │   ├── styles/
│   │   ├── axios.js
│   │   └── main.jsx
│   └── index.html
│
└── README.md

🔄 Refresh Token Workflow

User logs in → receives accessToken + refreshToken (HTTP-only cookie)

Access token expires in short duration (e.g., 15 mins)

axiosPrivate interceptor detects 403

Calls /api/auth/refresh-token

New access token generated

User continues session smoothly
