const schemeRepository = require("../repositories/scheme.repository");

const getAllSchemes = async () => {
  return await schemeRepository.findAll();
};

const getSchemeById = async (id) => {
  return await schemeRepository.findById(id);
};

module.exports = {
  getAllSchemes,
  getSchemeById,
};