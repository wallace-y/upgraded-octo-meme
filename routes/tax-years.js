const taxYearRouter = require("express").Router();
const {
  getTaxYears,
  getTaxYearById,
} = require("../controllers/controllers.js");

//get all reviews
taxYearRouter.get("/", getTaxYears).get("/:tax_year_id", getTaxYearById);

module.exports = taxYearRouter;
