const logger = require("./responseLib");

const validateRequest = (schema, property = 'body') => {    // property: body, params, query
  return (req, res, next) => {
    const { error } = schema.validate(req[property], { abortEarly: false, stripUnknown: true });

    // If validation failed
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return logger.error(res, errorMessages, 400);
    }
    next(); // Proceed to next middleware or controller if validation is successful
  };
};

module.exports = validateRequest;