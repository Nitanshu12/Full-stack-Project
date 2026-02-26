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
const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.BACKEND_URL1,
    'https://collabsphere-five.vercel.app',
    'http://localhost:5173', // Vite default dev server
    'http://localhost:3000'  // Common React dev server
].filter(Boolean); // Remove undefined values

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Check if origin is in allowed list
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            // Log for debugging
            console.log('CORS blocked origin:', origin);
            console.log('Allowed origins:', allowedOrigins);
            callback(new Error("CORS blocked: " + origin));
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

const PORT = 8080 || process.env.PORT


connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("connnect to DB")
        console.log("Server is running " + PORT)
    })
})