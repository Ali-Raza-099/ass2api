const { pictureValidation } = require("../modals/pictures");

function validatePicture(req, res, next) {
  let { error } = pictureValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  next();
}

module.exports = validatePicture;
