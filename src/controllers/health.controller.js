const healthService = require("../services/health.service");

const getHealth = async (req, res) => {
  try {
    const health = await healthService.checkHealth();

    res.status(200).json(health);
  } catch (error) {
    res.status(500).json({
      success: false,
      status: "DOWN",
      database: "Disconnected",
      error: error.message,
    });
  }
};

module.exports = {
  getHealth,
};