const connection = require("../db/connection.js");

function getTaxYears(req, res, next) {
  console.log("In the controller");
  return connection
    .query(`SELECT * FROM tax_years;`)
    .then(({rows} ) => {
      console.log(rows);
      res.status(200).send(rows);
    })
    .catch(next);
}

module.exports = { getTaxYears };
