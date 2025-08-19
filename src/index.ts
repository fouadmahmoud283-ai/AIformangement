import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
const publicPath = path.join(__dirname, "..", "public");
app.use(express.static(publicPath));

// Routes
app.get("/", (_req, res) => {
  res.sendFile(path.join(publicPath, "signup.html"));
});

app.get("/signup", (_req, res) => {
  res.sendFile(path.join(publicPath, "signup.html"));
});

// API endpoint for signup form submission
app.post("/api/signup", (req, res) => {
  void (async () => {
    try {
      const { email, username, password, confirmPassword, terms } = req.body;

      // Basic validation
      if (!email || !username || !password || !confirmPassword || !terms) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: "Passwords do not match",
        });
      }

      // Email format validation
      const emailRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format",
        });
      }

      // Username validation
      if (username.length < 3 || username.length > 20) {
        return res.status(400).json({
          success: false,
          message: "Username must be between 3 and 20 characters",
        });
      }

      // Password strength validation
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          success: false,
          message: "Password does not meet strength requirements",
        });
      }

      // Simulate user creation (replace with actual database logic)
      console.log("Creating user account:", {
        email,
        username,
        // Don't log the actual password in production
        passwordLength: password.length,
        termsAccepted: terms,
      });

      // Simulate async operation (database save, email sending, etc.)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Success response
      res.status(201).json({
        success: true,
        message: "Account created successfully",
        data: {
          id: Math.random().toString(36).substr(2, 9), // Generate random ID
          email,
          username,
          createdAt: new Date().toISOString(),
        },
      });
      return;
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error. Please try again later.",
      });
      return;
    }
  })();
});

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// 404 handler for API routes
app.use("/api/*", (_req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

// Catch-all handler: send back signup page for any non-API routes
app.get("*", (_req, res) => {
  res.sendFile(path.join(publicPath, "signup.html"));
});

// Error handling middleware
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error("Unhandled error:", err);
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  },
);

// Start server
async function startServer() {
  try {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📁 Serving static files from: ${publicPath}`);
      console.log(
        `📝 Signup page available at: http://localhost:${PORT}/signup`,
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  process.exit(0);
});

// Start the server
startServer().catch(console.error);








