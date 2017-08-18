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

        let logglyCustomTags = this.config.default("merapi.logging.loggly.customTags", []);
        logglyCustomTags.map(e => tags.push(e));

        let logglyConfig = this.config.default("merapi.logging.loggly.config", {});
        logglyConfig.tags = tags;
        let { length, timeout } = this.config.default("merapi.logging.loggly.buffer", { length: 50, timeout: 5000 });
        let logglyLogger = new loggly(logglyConfig, length, timeout);

        let logglyLevel = this.config.default("merapi.logging.loggly.level", "debug");
        let logglyStream = {
            type: "raw",
            level: logglyLevel,
            stream: logglyLogger
        };

        let consoleLevel = this.config.default("merapi.logging.level", "info");
        let consoleStream = {
            level: consoleLevel,
            stream: process.stdout
        };

        let streams = [consoleStream];
        let logglyConsoleOnly = this.config.default("merapi.logging.loggly.consoleOnly", false);
        if (!logglyConsoleOnly) {
            streams.push(logglyStream);
        }

        let logger = bunyan.createLogger({ name, streams });
        let ret = {};

        ret.trace = (...args) => { this.doLog("trace", logger, ...args) };
        ret.log = (...args) => { this.doLog("debug", logger, ...args) };
        ret.debug = (...args) => { this.doLog("debug", logger, ...args) };
        ret.info = (...args) => { this.doLog("info", logger, ...args) };
        ret.warn = (...args) => { this.doLog("warn", logger, ...args) };
        ret.error = (...args) => { this.doLog("error", logger, ...args) };
        ret.fatal = (...args) => { this.doLog("fatal", logger, ...args) };

        return ret;
    }

    doLog(level, logger, ...args) {
        let [first, ...rest] = args;
        let obj = { "logName": level.toUpperCase() };

        if (first !== null && typeof first === "object") {
            obj = Object.assign(first, obj);
            logger[level](obj, ...rest);
        } else {
            logger[level](obj, first, ...rest);
        }
    }
}

module.exports = LogglyManager;