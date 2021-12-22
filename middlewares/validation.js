const Ajv = require("ajv");
const ajv = new Ajv();

const getValidationMiddleware = (schema) => {
  const validate = ajv.compile(schema);
  return (req, res, next) => {
    const valid = validate(req.body);
    if (!valid) {
      res.status(400);
      res.send({ errors: validate.errors });
    } else {
      next();
    }
  };
};
module.exports = getValidationMiddleware;
