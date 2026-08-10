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

app.use(
  cors({
    origin: "http://localhost:5173", // <-- Allow your frontend origin only
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // HTTP methods allowed
    credentials: true, // <-- If you want to allow cookies/auth headers (optional)
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
