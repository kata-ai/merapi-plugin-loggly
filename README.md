# Merapi-Plugin-Loggly
Pluginable loggly for Merapi

## Installation
Install using npm:
```
npm install @yesboss/merapi-plugin-loggly --save
```

## Configuration

```
{
    ....
    "plugins": [
        "loggly@yesboss",
        .....
    ]
    "logging": {
        "loggly": {
            "subdomain": "yesbossnow",
            "token": "95c6c1a1-ddb0-479b-bfc7-f1a0b168989c",
            "json": true,
            "stack-name": "stack-name"
        }
    }    
}
```
## Usage 
### Manual
```
let logger = yield container.resolve("logger");

logger.log('silly', "a silly info");
logger.log('debug', "a debug level info");
logger.log('verbose', "a verbose level info");
logger.log('info', "an info");
logger.log('warn', "a warn level info");
logger.log('error', "an error level info");

logger.info("an usefull info");
logger.warn("a warn level info");
logger.error("an error info");
```

### Automatic injection
```
"use strict";
const Component = require("@yesboss/merapi/component");

module.exports = class FirstComponent extends Component {
    constructor(logger) {
        super();
        this._counter = 0;
        this.logger = logger;
    }
    getCounter() {
        this.logger.info("execute getCounter");
        return this._counter;
    }
};
```

## Copyright
Copyright (c) 2015-2016 YesBoss Group. All rights reserved.
We plan to open source this later in 2016, however please do not share
this before we officially release this as open source.

## Contributors
Initial Author: Roni Kurniawan