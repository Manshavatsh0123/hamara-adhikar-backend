const eligibilityRepository = require("../repositories/eligibility.repository");

// Helper function to check if a user's value exists in a PostgreSQL TEXT[] column
const matchesArray = (dbValues, userValue) => {
    if (!dbValues || dbValues.length === 0) {
        return true;
    }

    return dbValues
        .map(value => value.toLowerCase())
        .includes(userValue.toLowerCase());
};

const checkEligibility = async (userData) => {

    const rule = await eligibilityRepository.findRule(userData.schemeId);

    if (!rule) {
        throw new Error("Eligibility rules not found");
    }

    let eligible = true;

    const reasons = [];

    // Age
    if (
        userData.age < rule.min_age ||
        userData.age > rule.max_age
    ) {
        eligible = false;
        reasons.push("Age criteria not satisfied");
    }

    // Gender
    if (
        rule.gender &&
        rule.gender.toLowerCase() !== userData.gender.toLowerCase()
    ) {
        eligible = false;
        reasons.push("Gender criteria not satisfied");
    }

    // State
    if (!matchesArray(rule.state, userData.state)) {
        eligible = false;
        reasons.push("State criteria not satisfied");
    }

    // Occupation
    if (!matchesArray(rule.occupation, userData.occupation)) {
        eligible = false;
        reasons.push("Occupation criteria not satisfied");
    }

    // Income
    if (
        rule.income_limit &&
        userData.income > rule.income_limit
    ) {
        eligible = false;
        reasons.push("Income exceeds eligibility limit");
    }

    // Caste
    if (!matchesArray(rule.caste, userData.caste)) {
        eligible = false;
        reasons.push("Caste criteria not satisfied");
    }

    // Disability
    if (
        rule.disability !== null &&
        rule.disability !== userData.disability
    ) {
        eligible = false;
        reasons.push("Disability criteria not satisfied");
    }

    return {
        eligible,
        reasons
    };
};

module.exports = {
    checkEligibility
};