const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const connectDB = require('./config/db')

// Shared auth routes
const authRouter = require('./routes/authRoutes.js')

// Shared content routes (accessible by all authenticated users)
const postRouter = require('./routes/postRoutes.js')

// Legacy routes (kept for backward compatibility)
const projectRouter = require('./routes/projectRoutes.js')
const connectionRouter = require('./routes/connectionRoutes.js')

// Role-scoped routes
const studentRouter = require('./routes/studentRoutes.js')
const mentorRouter = require('./routes/mentorRoutes.js')
const organizationRouter = require('./routes/organizationRoutes.js')
const adminRouter = require('./routes/adminRoutes.js')


const app = express()

// Normalize and collect all allowed origins
const rawOrigins = [
    process.env.FRONTEND_URL,
    process.env.FRONTEND_URL1, // Fixed from BACKEND_URL1
    'https://collabsphere-five.vercel.app',
    'http://localhost:5173',
    'http://localhost:5174', // Added for cases where 5173 is in use
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://localhost:3000'
];

// Remove trailing slashes and filter out empty values
const allowedOrigins = rawOrigins
    .filter(Boolean)
    .map(url => url.replace(/\/$/, ''));

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, or server-to-server)
        if (!origin) return callback(null, true);
        
        // Normalize search: origin sent by browser never has trailing slash
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            console.log('Allowed origins:', allowedOrigins);
            callback(new Error("CORS blocked by CollabSphere Policy"));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json())
app.use(cookieParser())

// Shared auth routes
app.use("/api", authRouter)

// Shared content routes
app.use("/api/post", postRouter)

// Legacy routes (backward compatibility)
app.use("/api/project", projectRouter)
app.use("/api/connections", connectionRouter)

// Role-scoped routes
app.use("/api/student", studentRouter)
app.use("/api/mentor", mentorRouter)
app.use("/api/organization", organizationRouter)
app.use("/api/admin", adminRouter)

const PORT = process.env.PORT || 8080


connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("connnect to DB")
        console.log("Server is running " + PORT)
    })
})