const { createRef, formatRates } = require("../db/seeds/utils.js");

describe("createRef", () => {
  test("returns an empty object, when passed an empty array", () => {
    const input = [];
    const actual = createRef(input);
    const expected = {};
    expect(actual).toEqual(expected);
  });
  test("returns a reference object when passed an array with a single items", () => {
    const input = [{ title: "title1", article_id: 1, name: "name1" }];
    let actual = createRef(input, "title", "article_id");
    let expected = { title1: 1 };
    expect(actual).toEqual(expected);
    actual = createRef(input, "name", "title");
    expected = { name1: "title1" };
    expect(actual).toEqual(expected);
  });
  test("returns a reference object when passed an array with many items", () => {
    const input = [
      { title: "title1", article_id: 1 },
      { title: "title2", article_id: 2 },
      { title: "title3", article_id: 3 },
    ];
    const actual = createRef(input, "title", "article_id");
    const expected = { title1: 1, title2: 2, title3: 3 };
    expect(actual).toEqual(expected);
  });
  test("does not mutate the input", () => {
    const input = [{ title: "title1", article_id: 1 }];
    const control = [{ title: "title1", article_id: 1 }];
    createRef(input);
    expect(input).toEqual(control);
  });
});

describe("formatRates", () => {
  test("returns an empty array, if passed an empty array", () => {
    const rates = [];
    expect(formatRates(rates, {})).toEqual([]);
    expect(formatRates(rates, {})).not.toBe(rates);
  });
  test("converts tax_year key to tax_year_id", () => {
    const rates = [{ tax_year: "1990_1991" }];
    const ratesRef = { "1990_1991": 1, "1991_1992": 2, "1992_1993": 3 };
    const formattedRates = formatRates(rates, ratesRef);
    expect(formattedRates[0].tax_year_id).toEqual(1);
  });
});
