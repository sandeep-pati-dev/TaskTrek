import rateLimit from "express-rate-limit";

/**
 * Rate Limiter for Authentication Endpoints (Login/Signup).
 * Restricts client IPs to 20 requests per 15-minute window to mitigate brute-force attempts.
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per window
  message: {
    message: "Too many login/signup attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true, // Return standard headers (RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset)
  legacyHeaders: false, // Disable legacy X-RateLimit headers
});
