const db = require("../connection");
const format = require("pg-format");
const { createRef, formatRates } = require("../seeds/utils.js");

const seed = ({ taxTables, ratesOfIncomeTax }) => {
  return db
    .query(`DROP TABLE IF EXISTS rates_of_income_tax;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS class_1_nic_rates;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS other_nic_rates;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS tax_years;`);
    })
    .then(() => {
      return db.query(`
              CREATE TABLE tax_years (id SERIAL PRIMARY KEY,tax_year text,personal_allowance INT,married_couples_allowance INT,blind_person_allowance INT,dividends_allowance INT,savings_basic_rate INT,savings_higher_rate INT,aged_allowance_65_to_75 INT,aged_allowance_75_plus INT,aged_allowance_65_to_75_married INT,aged_allowance_75_plus_married INT,married_couples_income_limit INT);`);
    })
    .then(() => {
      const class1NICTablePromise = db.query(`
        CREATE TABLE class_1_nic_rates (
            id SERIAL PRIMARY KEY,
            tax_year_id INT REFERENCES tax_years(id) NOT NULL,
            LEL_week INT,
            PT_week INT,
            ST_week INT,
            UST_week INT,
            AUST INT,
            UAP INT,
            UEL INT,
            primary_PT_to_UEL_cont_rate INT,
            primary_above_UEL_cont_rate INT,
            primary_LEL_to_UAP_and_UEL_cont_rate INT,
            primary_reduced_rate INT,
            secondary_above_ST INT,
            secondary_COSRS_rate INT,
            secondary_COMPS_rate INT
        );`);
      const otherNICTablePromise = db.query(`
        CREATE TABLE other_nic_rates (
        id SERIAL PRIMARY KEY,
        tax_year_id integer REFERENCES tax_years(id) NOT NULL,
      class_1a_and_1b_rate integer,
      class_2_rate_week integer,
      class_2_small_earnings_year integer,
      class_3_flat_rate integer,
      class_4_LPL_year integer,
      class_4_UPL_year integer,
      class_4_main_rate_LPL_to_UPL integer,
      class_4_additional_cont_rate_above_UPL integer
      	);`);
      const ratesOfIncomeTaxTablePromise = db.query(`
      	CREATE TABLE rates_of_income_tax (
                  id SERIAL PRIMARY KEY,
                  tax_year_id integer REFERENCES tax_years(id) NOT NULL,
                  lower_rate_band integer,
                  lower_rate_band_tax integer,
                  starting_rate_band integer,
                  starting_rate_band_tax integer,
                  basic_rate_band integer,
                  basic_rate_band_tax integer,
                  higher_rate_band integer,
                  higher_rate_band_tax integer,
                  additional_rate_band integer,
                  additional_rate_band_tax integer,
                  savings_rate_band integer,
                  savings_rate_band_tax integer
      	);`);

      return Promise.all([
        class1NICTablePromise,
        otherNICTablePromise,
        ratesOfIncomeTaxTablePromise,
      ]);
    })
    .then(() => {
      const insertTaxTablesQueryStr = format(
        `INSERT INTO tax_years (tax_year,personal_allowance,married_couples_allowance,blind_person_allowance,dividends_allowance,savings_basic_rate,savings_higher_rate,aged_allowance_65_to_75,aged_allowance_75_plus,aged_allowance_65_to_75_married,aged_allowance_75_plus_married,married_couples_income_limit) VALUES %L RETURNING *;`,
        taxTables.map(
          ({
            tax_year,
            personal_allowance,
            married_couples_allowance,
            blind_person_allowance,
            dividends_allowance,
            savings_basic_rate,
            savings_higher_rate,
            aged_allowance_65_to_75,
            aged_allowance_75_plus,
            aged_allowance_65_to_75_married,
            aged_allowance_75_plus_married,
            married_couples_income_limit,
          }) => [
            tax_year,
            personal_allowance,
            married_couples_allowance,
            blind_person_allowance,
            dividends_allowance,
            savings_basic_rate,
            savings_higher_rate,
            aged_allowance_65_to_75,
            aged_allowance_75_plus,
            aged_allowance_65_to_75_married,
            aged_allowance_75_plus_married,
            married_couples_income_limit,
          ]
        )
      );

      const taxTablePromise = db.query(insertTaxTablesQueryStr);

      return taxTablePromise;
    })
    .then(({ rows: taxTableRows }) => {
      const taxYearIdLookup = createRef(taxTableRows, "tax_year", "id");
      const formattedRatesData = formatRates(ratesOfIncomeTax, taxYearIdLookup);

      const insertRatesQueryStr = format(
        `INSERT INTO rates_of_income_tax (            
          tax_year_id,
          lower_rate_band,
          lower_rate_band_tax,
          starting_rate_band,
          starting_rate_band_tax,
          basic_rate_band,
          basic_rate_band_tax,
          higher_rate_band,
          higher_rate_band_tax,
          additional_rate_band,
          additional_rate_band_tax,
          savings_rate_band,
          savings_rate_band_tax) VALUES %L;`,
        formattedRatesData.map(
          ({
            tax_year_id,
            lower_rate_band,
            lower_rate_band_tax,
            starting_rate_band,
            starting_rate_band_tax,
            basic_rate_band,
            basic_rate_band_tax,
            higher_rate_band,
            higher_rate_band_tax,
            additional_rate_band,
            additional_rate_band_tax,
            savings_rate_band,
            savings_rate_band_tax,
          }) => [
            tax_year_id,
            lower_rate_band,
            lower_rate_band_tax,
            starting_rate_band,
            starting_rate_band_tax,
            basic_rate_band,
            basic_rate_band_tax,
            higher_rate_band,
            higher_rate_band_tax,
            additional_rate_band,
            additional_rate_band_tax,
            savings_rate_band,
            savings_rate_band_tax,
          ]
        )
      );
      return db.query(insertRatesQueryStr);
    })
    .then((result) => {
      // console.log(result);
    });
};

module.exports = seed;
