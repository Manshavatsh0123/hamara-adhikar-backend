const categoryRepository = require("../repositories/category.repository");

const getAllCategories = async () => {
  return await categoryRepository.findAll();
};

const getSchemesByCategory = async (category) => {
    return await categoryRepository.findByCategory(category);
};

module.exports = {
  getAllCategories,
  getSchemesByCategory
};