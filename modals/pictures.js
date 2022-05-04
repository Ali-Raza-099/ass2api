var mongoose = require("mongoose");
let Joi = require("joi").extend(require("@joi/date"));

let picturesSchema = mongoose.Schema({
  Title: String,
  Description: String,
  Date: String,
  Location: String,
  imgPath: String,
  imgId: String,
});

let Picture = mongoose.model("Pictures", picturesSchema);

function validatePictureDetails(data) {
  const schema = Joi.object({
    Title: Joi.string().min(3).max(20).required(),
    Description: Joi.string().min(10).required(),
    Date: Joi.date().format("DD-MM-YYYY").utc(),
    Location: Joi.string().min(3).required(),
  });
  return schema.validate(data, { abortEarly: false });
}

module.exports.Picture = Picture;
module.exports.pictureValidation = validatePictureDetails;
