Step-wise development plan:
Step 1: Setup & Basic Infrastructure
Initialize Node.js project, setup Express server
Connect MongoDB (done, nice!)
Setup basic folder structure (routes, models, controllers, middleware)

Step 2: User Authentication
Create User model in MongoDB
Signup and Login routes
Password hashing with bcrypt
JWT token generation and verification middleware

Step 3: Task Model & CRUD APIs
Design Task schema (title, desc, dueDate, status, priority, userId)
Create routes for create, read (all tasks for logged-in user), update, delete
Link tasks with user (authentication required)

Step 4: Frontend Setup (React or whatever you prefer)
Build UI components for login/signup
Dashboard layout for tasks display
Forms for adding and editing tasks

Step 5: Task Filtering & Sorting
Implement filter options on frontend & backend (status, priority, due date)
Add search functionality

Step 6: Notifications (Stretch Goal)
Setup backend cron jobs or push notifications
Integrate email service (SendGrid, Nodemailer) for reminders

Step 7: Polish & Deployment
Error handling & validation everywhere
Responsive UI tweaks
Deploy on Heroku/Vercel or any free cloud platform
Connect frontend & backend on production URLs

🧠 Overall Frontend Plan (React + Vite)
🔰 Step 1: Initial Setup
✅ Vite + React setup
✅ Tailwind CSS for styling (fast, clean, responsive)
✅ React Router DOM for navigation
✅ Axios for HTTP requests
✅ .env setup for API base URL

🧱 Step 2: Folder Structure
components/ – reusable UI parts like buttons, cards, loaders
pages/ – page-level components like Login, Signup, Dashboard
layouts/ – for AuthLayout (login/signup) and MainLayout (dashboard)
services/ – Axios setup + API calls
context/ – AuthContext to manage user and token globally
hooks/ – custom hooks like useAuth()
utils/ – token helpers, date formatters etc.

🔐 Step 3: Authentication Flow
Signup form
Login form
Token storage (in localStorage)
Protect routes using PrivateRoute component
AuthContext setup to manage auth state globally

📋 Step 4: Dashboard & Task UI
Dashboard layout (sidebar + task area)
Display all tasks (GET request)
Task card component
Logout button

✍️ Step 5: Task Management
Add task form (POST request)
Edit task modal or page (PUT)
Delete task with confirmation (DELETE)
Priorities and status dropdown

✍️ Step 6: Filter, Sort, Search
Filter by status
Sort by priority / due date
Search by task title

✨ Step 7: Polish & UX Improvements
Toasts for success/error (like react-hot-toast)
Loader animations
Empty state UI (no tasks)
Responsive design for mobile

🚀 Step 8: Deployment
Connect with backend (API URLs)
Vercel/Netlify deploy
Environment variables for prod
Final testing

TaskTrek/
├── server/
│   ├── config/       # DB config
│   │   └── db.js
│   ├── controllers/  # Logic for user & tasks
│   │   ├── taskController.js
│   │   └── userController.js
│   ├── middleware/   # Auth middleware
│   │   └── authMiddleware.js
│   ├── models/       # Mongoose models
│   │   ├── Task.js
│   │   └── User.js
│   ├── routes/       # Express routes
│   │   ├── taskRoutes.js
│   │   └── userRoutes.js
│   └── index.js      # Entry point
│
├── client/
│   ├── public/       # Public assets
│   └── src/
│       ├── components/ # React components
│       ├── App.js
│       └── index.js
│
├── .env              # Env for backend (DB URI, JWT secret)
└── README.md         # Project doc
