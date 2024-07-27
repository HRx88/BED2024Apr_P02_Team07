const Joi = require("joi");

const validateMessage = (req, res, next) => {
  const schema = Joi.object({
    userId:Joi.string().min(1),
    messageText: Joi.string().min(9).max(255),

    
  });

  const validation = schema.validate(req.body, { abortEarly: false }); // Validate request body

  if (validation.error) {
    const errors = validation.error.details.map((error) => error.message);
    res.status(400).json({ message: "Validation error", errors });
    return; // Terminate middleware execution on validation error
  }

  next(); // If validation passes, proceed to the next route handler
};

module.exports = validateMessage;
