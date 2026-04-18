import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRouter from "./routes/aiRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
await connectDB()

app.use(express.json())

// Place this BEFORE any app.use('/api', ...) lines
app.use(cors({
  origin: function (origin, callback) {
    // Allow local development and your specific Vercel domain
    const allowed = [
      'http://localhost:5173',
      'https://resu-mate-gamma.vercel.app'
    ];
    if (!origin || allowed.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS blocked this request'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// 4. Routes
app.get('/', (req, res) => res.send("Server is live..."));
app.use('/api/users', userRouter);
app.use('/api/resumes', resumeRouter);
app.use('/api/ai', aiRouter);
// ... other routes

// 5. START SERVER (This is what Render is looking for!)
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});