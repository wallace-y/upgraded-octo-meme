const taxYearRouter = require("express").Router();
const { getTaxYears } = require("../controllers/controllers.js");

//get all reviews
taxYearRouter.get("/", getTaxYears);

module.exports = taxYearRouter;
