/**
 * Reusable schema validator middleware that validates the request body properties.
 */
export const validateSchema = (schema) => {
  return (req, res, next) => {
    const errors = {};

    Object.keys(schema).forEach((key) => {
      const rules = schema[key];
      const val = req.body[key];

      // Required presence check (checks string trimming too)
      if (
        rules.required &&
        (val === undefined ||
          val === null ||
          (typeof val === "string" && !val.trim()))
      ) {
        errors[key] = `${key} is required and cannot be empty`;
        return;
      }

      // If value is missing and not required, skip type/length validations
      if (val === undefined || val === null) {
        return;
      }

      // Type validation
      if (rules.type) {
        if (rules.type === "string" && typeof val !== "string") {
          errors[key] = `${key} must be a string`;
          return;
        }
        if (rules.type === "boolean" && typeof val !== "boolean") {
          errors[key] = `${key} must be a boolean`;
          return;
        }
      }

      // String length validations
      if (typeof val === "string") {
        const trimmedVal = val.trim();
        if (rules.minLength && trimmedVal.length < rules.minLength) {
          errors[key] = `${key} must be at least ${rules.minLength} characters`;
        }
        if (rules.maxLength && trimmedVal.length > rules.maxLength) {
          errors[key] = `${key} cannot exceed ${rules.maxLength} characters`;
        }
      }

      // Email format pattern verification
      if (rules.isEmail) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (typeof val !== "string" || !emailRegex.test(val.trim())) {
          errors[key] = "Invalid email format";
        }
      }
    });

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        errors,
      });
    }

    next();
  };
};

// -------------------------------------------------------------
// Validation Schemas
// -------------------------------------------------------------

export const signupSchema = {
  name: { type: "string", required: true },
  email: { type: "string", required: true, isEmail: true },
  password: { type: "string", required: true, minLength: 6 },
};

export const loginSchema = {
  email: { type: "string", required: true, isEmail: true },
  password: { type: "string", required: true },
};

export const createTaskSchema = {
  title: { type: "string", required: true, maxLength: 100 },
  description: { type: "string", required: false, maxLength: 500 },
};

export const updateTaskSchema = {
  title: { type: "string", required: false, maxLength: 100 },
  description: { type: "string", required: false, maxLength: 500 },
  completed: { type: "boolean", required: false },
};
