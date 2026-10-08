const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
const mainRoutes = require("./routes/mainRoutes");
app.use("/", mainRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/api/user", userRoutes);

const routineRoutes = require("./routes/routineRoutes");
app.use("/api/routine", routineRoutes);

const exerciseRoutes = require("./routes/exerciseRoutes");
app.use("/api/exercise", exerciseRoutes);

const aiRoutes = require("./routes/aiRoutes");
app.use("/api/ai", aiRoutes);

module.exports = app;