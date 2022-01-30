const getValidationMiddleware = (schema) => {
  return (req, res, next) => {
    console.log("Validating the schema..");
    const result = schema.validate(req.body);
    if (result.error) {
      console.log(
        "Error in validating the data: " + result.error.details[0].message
      );
      res.status(400);
      res.send(result.error.details[0].message);
    } else {
      console.log("Successfully validated the schema, continue...");
      next();
    }
  };
};
module.exports = getValidationMiddleware;
