const searchService = require("../services/search.service");

// GET /api/search
const searchSchemes = async (req, res) => {

    try {

        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                message: "Search keyword is required"
            });
        }

        const schemes = await searchService.searchSchemes(q);

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

// GET /api/search/suggestions
const getSuggestions = async (req, res) => {

    try {

        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                message: "Search keyword is required"
            });
        }

        const suggestions = await searchService.searchSuggestions(q);

        res.status(200).json({
            success: true,
            count: suggestions.length,
            data: suggestions
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    searchSchemes,
    getSuggestions
};