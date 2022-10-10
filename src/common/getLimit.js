const getParcedLimit = (limit, defaultValue, maxValue) => {
  return limit ? (limit > maxValue ? maxValue : limit) : defaultValue;
};

exports.getParcedLimit = getParcedLimit;
