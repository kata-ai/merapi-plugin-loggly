"use strict";

const chai      = require("chai");
const expect    = chai.expect;
const merapi    = require("@yesboss/merapi");
const Component = require("@yesboss/merapi/component");
const async     = require("@yesboss/merapi/async");

/* eslint-env mocha */

describe("merapi-plugin-loggly unit test", function() {
    let container, LogglyManager;

    before(function() {
        container = merapi({
            basepath: __dirname,
            config: {
                name: "test",
                version: "0.0.1",
                main: "mainComponent",
                logglyLogger: {
                    subdomain: "worksinmagic",
                    token: "d0ac1e8d-8de4-4681-86c7-ac5b6f498e26",
                    json: true,
                    tags: ["merapi-plugin-loggly"],
                    isBulk: true
                }
            }
        });

        container.registerPlugin("loggly@yesboss", require("../index.js")(container));
        container.register("mainComponent", class MainComponent extends Component {
            constructor(logger) {
                super();
                this.logger = logger;
            }
            start() {
                this.logger.info("TEST FROM TESTER");
            }
        });

        container.start();
    });

    it("should get logglyManager initialized", async(function* () {
        LogglyManager = yield container.resolve("logglyManager");
        expect(LogglyManager).to.not.be.null;
    }));
});