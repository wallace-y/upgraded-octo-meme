const connection = require("../db/connection.js");
const { selectTaxYearById } = require("../models/models.js");

function getTaxYears(req, res, next) {
  return connection
    .query(`SELECT * FROM tax_years;`)
    .then(({ rows }) => {
      res.status(200).send(rows);
    })
    .catch(next);
}

function getTaxYearById(req, res, next) {
  const { tax_year_id } = req.params;
  selectTaxYearById(tax_year_id)
    .then((tax_year) => {
      res.status(200).send({ tax_year });
    })
    .catch(next);
}

module.exports = { getTaxYears, getTaxYearById };
