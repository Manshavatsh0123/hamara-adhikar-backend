const eligibilityRepository = require("../repositories/eligibility.repository");

// Helper function to check if a user's value exists in a PostgreSQL TEXT[] column
const matchesArray = (dbValues, userValue) => {

    if (!dbValues || dbValues.length === 0) {
        return true;
    }

    if (!userValue) {
        return false;
    }

    return dbValues.some(
        value =>
            value.toLowerCase() === userValue.toLowerCase()
    );
};

const checkEligibility = async (userData) => {

    const rule = await eligibilityRepository.findRuleWithScheme(userData.schemeId);

    console.log("USER DATA:", userData);
    console.log("DB RULE:", rule);

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

    console.log("ELIGIBLE:", eligible);
    console.log("REASONS:", reasons);

    return {
        eligible,

        message: eligible
            ? "You are eligible for this scheme."
            : "You are not eligible for this scheme.",

        reasons,

        nextStep: eligible
            ? "You can proceed with the application."
            : "Please review the eligibility requirements and explore other schemes.",

        scheme: {
            id: rule.scheme_id,
            name: rule.scheme_name,
            department: rule.department,
            state: rule.scheme_state,
            description: rule.description
        }
    };
};

module.exports = {
    checkEligibility
};