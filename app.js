const express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const apiRouter = require("./routes/api-router.js");
const taxYearRouter = require("./routes/tax-years.js");

var app = express();

// app.use(logger("dev"));
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));

app.use("/api", apiRouter);
apiRouter.use("/taxYears", taxYearRouter);

//handling 404 errors - no available endpoint
app.use("/api/*", (req, res) => {
  res.status(404).send({ msg: "Resource not found." });
});

//handling 500 errors
app.use((err, req, res, next) => {
  //handle custom errors later
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
  //psql errors
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request." });
  }
  //Key (<column-name>)=(XXX) is not present in table
  if (err.code === "23503") {
    res.status(404).send({ msg: "Resource not found." });
  }
  // if the error hasn't been identified,
  // respond with an internal server error
  else {
    res.status(500).send({ msg: "Internal Server Error" });
  }
  console.log(err)
});

module.exports = app;
