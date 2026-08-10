import "dotenv/config";
import express from "express";
import cors from "cors"; // <-- Import cors here
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import errorHandler from "./middleware/errorMiddleware.js";
import helmet from "helmet";

const app = express();

connectDB();

// Secure headers with Helmet middleware
app.use(helmet());

const allowedOrigins = [
  "http://localhost:5173",
  "https://task-trek-seven.vercel.app",
];

if (process.env.FRONTEND_URL) {
  const cleanedUrl = process.env.FRONTEND_URL.replace(/\/$/, "");
  if (!allowedOrigins.includes(cleanedUrl)) {
    allowedOrigins.push(cleanedUrl);
  }
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Limit JSON request payload sizes to 10kb to avoid oversized payloads
app.use(express.json({ limit: "10kb" }));
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("TaskTrek Server Running 🔥");
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🌐 Server running on http://localhost:${PORT}`);
});
