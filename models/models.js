const connection = require("../db/connection.js");

function selectTaxYearById(tax_year_id) {
  return connection
    .query(`SELECT * FROM tax_years WHERE id = $1;`, [tax_year_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Resource not found." });
      } else {
        return rows[0];
      }
    });
}

module.exports = { selectTaxYearById };
