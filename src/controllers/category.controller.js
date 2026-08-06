const categoryService = require("../services/category.service");

const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSchemesByCategory = async (req, res) => {

    try {

        const { category } = req.params;

        const schemes = await categoryService.getSchemesByCategory(category);

        if (schemes.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No schemes found for this category"
            });
        }

        res.status(200).json({
            success: true,
            count: schemes.length,
            data: schemes
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
  getAllCategories,
  getSchemesByCategory
};