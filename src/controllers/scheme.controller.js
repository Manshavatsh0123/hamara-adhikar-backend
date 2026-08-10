const schemeService = require("../services/scheme.service");
const schemeRepository = require("../repositories/scheme.repository");


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


const getSchemeById = async (req, res) => {
  try {
    const { id } = req.params;

    const scheme = await schemeService.getSchemeById(id);

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: "Scheme not found",
      });
    }

    res.status(200).json({
      success: true,
      data: scheme,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getRandomSchemes = async (req, res, next) => {

  try {

    const schemes =
      await schemeRepository.getRandomSchemes();

    res.status(200).json({
      success: true,
      data: schemes
    });

  } catch (error) {

    next(error);

  }

};

const getStats = async (req, res, next) => {

    try {

        const stats =
            await schemeRepository.getStats();

        res.status(200).json({
            success: true,
            data: stats
        });

    } catch (error) {

        next(error);

    }

};

module.exports = {
  getAllSchemes,
  getSchemeById,
  getRandomSchemes,
  getStats
};