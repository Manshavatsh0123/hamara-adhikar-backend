const schemeRepository = require("../repositories/scheme.repository");

const getAllSchemes = async () => {
  return await schemeRepository.findAll();
};

module.exports = {
  getAllSchemes,
};