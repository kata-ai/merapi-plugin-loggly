"use strict";

const { Component } = require("merapi");

const os = require("os");
const bunyan = require("bunyan");
const loggly = require("bunyan-loggly");

class OSStats extends Component {

    constructor(config) {
        super();

        this.config = config;

        this.logCpu = (logger) => logger.debug({ cpu: os.cpus() });
        this.logMem = (logger) => logger.debug({ total: os.totalmem(), free: os.freemem() });
        this.logLoadAvg = (logger) => logger.debug({ loadavg: os.loadavg() });
        this.logUptime = (logger) => logger.debug({ uptime: os.uptime() });
    }

    *initialize() {
        let env = process.env.NODE_ENV || "development";
        if (env !== "production") return;

        let host = os.hostname();
        let name = this.config.default("name", "merapi-application");
        let version = this.config.default("version", "1.0.0");
        let fullName = `${name}-${version}`;

        let logglyConfig = this.config.default("merapi.logging.loggly.config", {});

        let tags = [host, env, name, fullName];
        let logglyCustomTags = this.config.default("merapi.logging.loggly.customTags", []);
        logglyCustomTags.map(e => tags.push(e));
        logglyConfig.tags = tags;

        let interval = this.config.default("merapi.logging.loggly.os.interval", 5000);
        let logglyLogger = new loggly(logglyConfig, 50, interval);

        let logglyStream = {
            type: "raw",
            level: "debug",
            stream: logglyLogger
        };

        let streams = [logglyStream];
        let logger = bunyan.createLogger({ name, streams });

        let defaultOsStatsConfig = { cpu: true, mem: true, loadavg: true, uptime: true };
        let osStatsConfig = this.config.default("merapi.logging.loggly.os", defaultOsStatsConfig);
        setInterval(this.log.bind(this, logger, osStatsConfig), 5000)
    }

    log(logger, cfg) {
        if (cfg.cpu) this.logCpu(logger);
        if (cfg.mem) this.logMem(logger);
        if (cfg.loadavg) this.logLoadAvg(logger);
        if (cfg.uptime) this.logUptime(logger);
    }

}

module.exports = OSStats;