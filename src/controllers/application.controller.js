const applicationRepository = require("../repositories/application.repository");

const getApplication = async (req, res) => {

    try {

        const { id } = req.params;

        const application =
            await applicationRepository.getApplicationInfo(id);

        if (!application) {

            return res.status(404).json({
                success: false,
                message: "Application information not found"
            });

        }

        return res.status(200).json({
            success: true,
            data: {
                schemeId: application.id,
                schemeName: application.scheme_name,
                applicationProcess: application.application_process,
                requiredDocuments: application.documents_required,
                officialSource: application.official_source
            }
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch application information"
        });
    }
};

module.exports = {
    getApplication
};