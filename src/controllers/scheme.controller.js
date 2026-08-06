const schemeService = require("../services/scheme.service");

const getAllSchemes = async (req, res) => {
  try {
    const schemes = await schemeService.getAllSchemes();

    res.status(200).json({
      success: true,
      count: schemes.length,
      data: schemes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllSchemes,
};