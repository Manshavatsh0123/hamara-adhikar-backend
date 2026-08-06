const recommendationRepository = require("../repositories/recommendation.repository");

const matchesArray = (dbValues, userValue) => {

    if (!dbValues || dbValues.length === 0) {
        return true;
    }

    return dbValues
        .map(value => value.toLowerCase())
        .includes(userValue.toLowerCase());

};

const getRecommendations = async (userData) => {

    const schemes =
        await recommendationRepository.findAllSchemes();

    const recommendations = [];

    for (const scheme of schemes) {

        let score = 0;

        const reasons = [];

        if (
            userData.age >= scheme.min_age &&
            userData.age <= scheme.max_age
        ) {

            score += 20;

            reasons.push("Age matched");

        }

        if (
            scheme.gender &&
            scheme.gender.toLowerCase() ===
            userData.gender.toLowerCase()
        ) {

            score += 20;

            reasons.push("Gender matched");

        }

        if (
            matchesArray(
                scheme.eligible_states,
                userData.state
            )
        ) {

            score += 20;

            reasons.push("State matched");

        }

        if (
            matchesArray(
                scheme.occupation,
                userData.occupation
            )
        ) {

            score += 15;

            reasons.push("Occupation matched");

        }

        if (
            userData.income <= scheme.income_limit
        ) {

            score += 15;

            reasons.push("Income matched");

        }

        if (
            matchesArray(
                scheme.caste,
                userData.caste
            )
        ) {

            score += 5;

            reasons.push("Caste matched");

        }

        if (
            scheme.disability ===
            userData.disability
        ) {

            score += 5;

            reasons.push("Disability matched");

        }

        recommendations.push({

            schemeId: scheme.id,

            schemeName: scheme.scheme_name,

            department: scheme.department,

            score,

            reasons

        });

    }

    recommendations.sort(
        (a, b) => b.score - a.score
    );

    return recommendations.slice(0, 5);

};

module.exports = {

    getRecommendations

};