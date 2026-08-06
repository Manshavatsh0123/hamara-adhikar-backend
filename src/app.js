const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const healthRoutes = require("./routes/health.routes");
const schemeRoutes = require("./routes/scheme.routes");
const categoryRoutes = require("./routes/category.routes");

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/health", healthRoutes);
app.use("/api/schemes", schemeRoutes);
app.use("/api/categories", categoryRoutes);

module.exports = app;