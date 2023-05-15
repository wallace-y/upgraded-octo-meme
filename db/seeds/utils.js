exports.createRef = (arr, key, value) => {
  return arr.reduce((ref, element) => {
    ref[element[key]] = element[value];
    return ref;
  }, {});
};

exports.formatRates = (rates, idLookup) => {
  return rates.map(({ tax_year, ...restOfObj }) => {
    const tax_year_id = idLookup[tax_year];
    return {
      tax_year_id,
      ...restOfObj,
    };
  });
};
