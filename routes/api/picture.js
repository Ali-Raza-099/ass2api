var express = require("express");
const cloudinary = require("cloudinary").v2;
const { Picture } = require("../../modals/pictures");
const validatePicture = require("../../middlewares/validatePicture");
var config = require("config");
const app = require("../../app");

var router = express.Router();

cloudinary.config({
  cloud_name: config.get("cloud_name"),
  api_key: config.get("api_key"),
  api_secret: config.get("api_secret"),
  secure: true,
});

//get all pictures
router.get("/", async (req, res) => {
  let picture = await Picture.find();
  return res.send(picture);
});

//getting a one picture
router.get("/:id", async (req, res) => {
  try {
    let picture = await Picture.findById(req.params.id);
    if (!picture)
      return res.status(400).send("picture with given id in not present");
    return res.send(picture);
  } catch (err) {
    return res.status(400).send("Invalid ID");
  }
});

//add a picture and details
router.post("/", validatePicture, (req, res) => {
  const file = req.files.photo;
  if (file.size > 5 * 1024 * 1024) {
    return res.status(400).json({ msg: "Size too large" });
  }
  cloudinary.uploader.upload(file.tempFilePath, async (err, result) => {
    let picture = new Picture();
    picture.Title = req.body.Title;
    picture.Description = req.body.Description;
    picture.Date = req.body.Date;
    picture.Location = req.body.Location;
    picture.imgPath = result.url;
    picture.imgId = result.public_id;
    await picture.save();
    return res.send(picture);
  });
});

//update a picture details
router.put("/:id", validatePicture, async (req, res) => {
  let picture = await Picture.findById(req.params.id);
  picture.Title = req.body.Title;
  picture.Description = req.body.Description;
  picture.Date = req.body.Date;
  picture.Location = req.body.Location;
  await picture.save();
  return res.send(picture);
});

//delete a picture
router.delete("/:id", async (req, res) => {
  try {
    let picture = await Picture.findById(req.params.id);
    let cloud_id = picture.imgId;
    cloudinary.uploader.destroy(cloud_id, async (err, result) => {
      let picture = await Picture.findByIdAndDelete(req.params.id);
      return res.send(picture);
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
