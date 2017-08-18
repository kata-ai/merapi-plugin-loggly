# Merapi Plugin Loggly
## Installation
Install using npm:
```
npm install merapi-plugin-loggly --save
```

## Configuration

```
plugins:
    - loggly
    - service

merapi:
    logging:
        level: info

        loggly:
            level: debug
            buffer:
                length: 50
                timeout: 5000
            config:
                subdomain: yesbossnow
                token: de7bf9fe-af47-413d-a002-a4498280b601
            customTags:
                - diaenne-platform
                - experiment
            consoleOnly: true
            os:
                interval: 5000
                cpu: false
                mem: true
                loadavg: true
                uptime: false
```
## Usage 
```
"use strict";
const { Component } = require("merapi");

module.exports = class MainComponent extends Component {
    constructor(logger) {
        super();
        this.logger = logger;
    }

    *initialize() {
        this.logger.info("Starting app...");
    }
};
```

## Contributors
Initial Authors:

* Roni Kurniawan
* Hisma Mulya
* Andida Syahendar

Authors:

* Ikmal Syifai
