const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const projectsRoute = require("./projects/router");
const actionsRoute = require("./actions/router");

const server = express();
server.use(cors());
server.use(helmet());
server.use(morgan("dev"));
server.use(express.json());

server.use("/api/projects", projectsRoute);
server.use("/api/actions", actionsRoute);

module.exports = server;
