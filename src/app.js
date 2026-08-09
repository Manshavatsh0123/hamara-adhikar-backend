const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const apiLimiter = require("./middleware/rateLimit.middleware");
const notFound = require("./middleware/notFound.middleware");
const errorHandler = require("./middleware/error.middleware");

const healthRoutes = require("./routes/health.routes");
const schemeRoutes = require("./routes/scheme.routes");
const categoryRoutes = require("./routes/category.routes");
const departmentRoutes = require("./routes/department.routes");
const searchRoutes = require("./routes/search.routes");
const eligibilityRoutes = require("./routes/eligibility.routes");
const recommendationRoutes = require("./routes/recommendation.routes");
const aiRoutes = require("./routes/ai.routes");
const applicationRoutes = require("./routes/application.routes");


const app = express();


app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(
    express.json({
        limit: "1mb"
    })
);
app.use(
    express.urlencoded({
        extended: true,
        limit: "1mb"
    })
);


// Apply rate limiting to all /api routes

app.use("/api", apiLimiter);


// API ROUTES

app.use("/api/health", healthRoutes);
app.use("/api/schemes", schemeRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/eligibility", eligibilityRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api", applicationRoutes);


// 404 HANDLER

// This must come AFTER all routes.
app.use(notFound);

// This must be the LAST middleware.
app.use(errorHandler);


module.exports = app;