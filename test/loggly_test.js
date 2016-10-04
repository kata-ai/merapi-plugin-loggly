"use strict";

const chai = require("chai");
const expect = chai.expect;
const merapi = require("@yesboss/merapi");
const Component = require("@yesboss/merapi/component");
const async = require("@yesboss/merapi/async");
const sleep = require("sleep-promise");

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

                logger: {
                    loggly: {
                        subdomain: "yesbossnow",
                        token: "95c6c1a1-ddb0-479b-bfc7-f1a0b168989c",
                        json: true
                    }
                },
                package: require("../package.json")
            }
        });

        container.registerPlugin("loggly@yesboss", require("../index.js")(container));
        container.register("mainComponent", class MainComponent extends Component {
            constructor(logger) {
                super();
                this.logger = logger;
            }
            start() {
                //console.log("logger", this.logger);

                this.logger.verbose("INFO TEST FROM TESTER");
            }
        });
        container.initialize();
        container.start();
    });

    after(function () {
        sleep(3000);
    });

    it("should get logglyManager initialized", async(function* (done) {
        sleep(3000);
        LogglyManager = yield container.resolve("logglyManager");
        let logger = yield container.resolve("logger");
        sleep(3000);
        //console.log("logger", logger);
        logger.verbose("verbose TEST FROM TESTER");
        expect(LogglyManager).to.not.be.null;
        done;
    }));


    sleep(3000);

});