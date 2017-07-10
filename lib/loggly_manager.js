"use strict";

const { Component } = require("merapi");

const os = require("os");
const bunyan = require("bunyan");
const loggly = require("bunyan-loggly");

class LogglyManager extends Component {
    constructor(config) {
        super();
        this.config = config;
    }

    createLogger(component) {
        /*
        tags:
        - host
        - env
        - app name
        - app name & version
        - component (only add component to tags if it exists to prevent error on loggly)
        */

        let host = os.hostname();
        let env = process.env.NODE_ENV || "development";
        let name = this.config.default("name", "merapi-application");
        let version = this.config.default("version", "1.0.0");
        let fullName = `${name}-${version}`;

        let tags = [host, env, name, fullName];
        if (component)
            tags.push(component);

        let logglyConfig = this.config.default("merapi.logging.loggly.config", {});
        logglyConfig.tags = tags;
        let logglyLogger = new loggly(logglyConfig);

        let logglyStream = {
            type: "raw",
            level: "debug",
            stream: logglyLogger
        };

        let consoleStream = {
            level: "info",
            stream: process.stdout
        };

        let logger = bunyan.createLogger({
            name,
            streams: [consoleStream, logglyStream]
        });

        return logger;
    }
}

module.exports = LogglyManager;