const searchRepository = require("../repositories/search.repository");

const searchSchemes = async (keyword) => {
    return await searchRepository.searchSchemes(keyword);
};

const searchSuggestions = async (keyword) => {
    return await searchRepository.searchSuggestions(keyword);
};

module.exports = {
    searchSchemes,
    searchSuggestions
};