const request = require("supertest");
const app = require("../app.js");
const connection = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data");

beforeEach(() => seed(testData));
afterAll(() => connection.end());

describe("GET /api/taxYears", () => {
  it("responds with a status code 200", () => {
    return request(app).get("/api/taxYears").expect(200);
  });
  it("content is JSON", () => {
    return request(app)
      .get("/api/taxYears")
      .expect("Content-Type", "application/json; charset=utf-8");
  });
  it("object has correct properties", () => {
    return request(app)
      .get("/api/taxYears")
      .then((res) => {
        const tax_year = res.body[0];
        expect(tax_year).toEqual(
          expect.objectContaining({
            id: 1,
            tax_year: "1990_1991",
            personal_allowance: 3005,
            married_couples_allowance: null,
            blind_person_allowance: 1080,
            dividends_allowance: null,
            savings_basic_rate: 0,
            savings_higher_rate: 0,
            aged_allowance_65_to_75: 3670,
            aged_allowance_75_plus: 3820,
            aged_allowance_65_to_75_married: 2145,
            aged_allowance_75_plus_married: 2185,
            married_couples_income_limit: 12300,
          })
        );
      });
  });
});

describe("GET /api/taxYears/:id - get review by ID", () => {
  it("returns a status code of 200", () => {
    return request(app).get("/api/taxYears/1").expect(200);
  });
  it("is correctly formatted as JSON", () => {
    return request(app)
      .get("/api/taxYears/1")
      .expect("Content-Type", "application/json; charset=utf-8");
  });
  it("Response has the correct properties", () => {
    return request(app)
      .get("/api/taxYears/1")
      .then((res) => {
        const tax_year = res.body.tax_year;
        expect(tax_year).toEqual(expect.objectContaining({}));
      });
  });
  it("Status 400, bad request - invalid ID", () => {
    return request(app)
      .get("/api/taxYears/bananas")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request.");
      });
  });
  it("Status 404, resource not found - invalid ID", () => {
    return request(app)
      .get("/api/taxYear/999999")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Resource not found.");
      });
  });
});

describe("Not found tests", () => {
  it("Status: 404, responds with an error message when passed an invalid path", () => {
    return request(app)
      .get("/api/notAnEndpoint")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Resource not found.");
      });
  });
});
