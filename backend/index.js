const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorHandler");

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/applications", require("./routes/applications"));
app.use("/api/resumes", require("./routes/resumes"));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "CoopTrack API is running",
    timestamp: new Date().toISOString(),
  });
});

// API documentation endpoint
app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to JobFolio API",
    version: "1.0.0",
    endpoints: {
      auth: {
        "POST /api/auth/register": "Register a new user",
        "POST /api/auth/login": "Login user",
        "GET /api/auth/me": "Get current user (protected)",
        "PUT /api/auth/me": "Update profile (protected)",
        "PUT /api/auth/password": "Update password (protected)",
      },
      applications: {
        "GET /api/applications": "Get all applications (protected)",
        "POST /api/applications": "Create application (protected)",
        "GET /api/applications/:id": "Get single application (protected)",
        "PUT /api/applications/:id": "Update application (protected)",
        "DELETE /api/applications/:id": "Delete application (protected)",
        "GET /api/applications/stats": "Get statistics (protected)",
        "PUT /api/applications/bulk-status": "Bulk update status (protected)",
      },
      resumes: {
        "GET /api/resumes": "Get all resume versions (protected)",
        "POST /api/resumes": "Create resume version (protected)",
        "GET /api/resumes/:id": "Get single resume (protected)",
        "PUT /api/resumes/:id": "Update resume (protected)",
        "DELETE /api/resumes/:id": "Delete resume (protected)",
        "GET /api/resumes/compare/:id1/:id2":
          "Compare two versions (protected)",
        "POST /api/resumes/:id/duplicate": "Duplicate a version (protected)",
      },
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT;

app.listen(PORT);

module.exports = app;
