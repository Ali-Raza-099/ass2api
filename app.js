var createError = require("http-errors");
const cors = require("cors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var config = require("config");
var mongoose = require("mongoose");
var fileUpload = require("express-fileupload");

//routes
var indexRouter = require("./routes/index");
var pictureRouter = require("./routes/api/picture");

var app = express();
app.use(cors());
//Database connection string
mongoose
  .connect(config.get("db"))
  .then(() => {
    console.log("Connection established successfully with database");
  })
  .catch((err) => {
    console.log(
      "Error has occurred while establishing the connection with database",
      err
    );
  });

app.use(
  fileUpload({
    useTempFiles: true,
  })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api/picture", pictureRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
