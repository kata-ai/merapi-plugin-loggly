"use strict";

const chai = require("chai");
const expect = chai.expect;
const merapi = require("merapi");
const { Component, async } = require("merapi");

/* eslint-env mocha */

describe("merapi-plugin-loggly unit test", function () {
    let container, LogglyManager;

    this.timeout(10000);

    before(function () {
        container = merapi({
            basepath: __dirname,
            config: {
                name: "test-logger-loggy",
                version: "0.0.1",
                main: "mainComponent",
                service: {
                    host: "0.0.0.0",
                    port: 5000,
                    api: {}
                },

                merapi: {
                    logging: {
                        level: "info",
                        loggly: {
                            level: "debug",
                            buffer: {
                                length: 50,
                                timeout: 5000
                            },
                            config: {
                                subdomain: "yesbossnow",
                                token: "de7bf9fe-af47-413d-a002-a4498280b601"
                            }
                        }
                    }
                },

                package: require("../package.json")
            }
        });

        container.registerPlugin("loggly@yesboss", require("../index.js")(container));
        container.register("mainComponent", class MainComponent extends Component {
            constructor() { super(); }
            start() { }
        });
        container.initialize();
        container.start();
    });

    it("should get logglyManager initialized", async(function* (done) {
        LogglyManager = yield container.resolve("logglyManager");
        expect(LogglyManager).to.not.be.null;
        done;
    }));

    it("should have correct loggly config", async(function* (done) {
        let expected = {
            subdomain: "yesbossnow",
            token: "de7bf9fe-af47-413d-a002-a4498280b601"
        };

        let config = yield container.resolve("config");
        let logglyConfig = config.default("merapi.logging.loggly.config", {});
        expect(logglyConfig).to.deep.include(expected);
        done;
    }));

});