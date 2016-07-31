Convenience utility to run [sitespeed.io](https://www.sitespeed.io/) tests using ES6 promises. In addition, it faciliates integration of sitespeed.io budget tests with [Mocha](https://mochajs.org/).

# usage examples:
## run a sitespeed.io test
### code
```
var sitespeedUtil = require('sitespeed-utils');

// load config from a file（path can be specified）
var sitespeedConfig = require('./config/sitespeed.json');

// run test
sitespeedUtil.run(sitespeedConfig).then(
  function(data) {
    // Tests completed without error. The data
    // param contains the full set of everything
    // sitepseed.io generates.
  },
  function(errors) {
    // error occured
  }
);
```

### sitespeed.json example
The JSON passed to `sitespeedUtil.run` can contain any parameter supported by sitespeed.io.

```
{
  "url": "http://www.cnn.com",

  "comment-on-depth": "Depth of 0 has to be specified as a string or it is ingnored.",
  "depth": "0"
}
```

## run performance budget test using mocha

### code
```
var sitespeedUtil = require('sitespeed-utils');

// load config from a file（path can be specified）
var config = require('./config/mocha-budget.json');

// Execute test
describe('Sitespeed Utils Test', function() {
    // Determine the mochaTimeout threshold
    var mochaTimeout = (typeof config.mochaTimeout === 'number' && config.mochaTimeout) || 120000;

    // Need to bump up time for the Sitespeed tests
    this.timeout(mochaTimeout);

    it('performanceBudgetTest', function() {
        return sitespeedUtil.mochaBudgetTest(config);
    });
});
```

### mocha-testcases.json example
The schema for Mocha tests assumes that you'll want to run tests for 1 to N pages on a single site. For convenience, there is a testCases block, and `mochaBudgetTest` will execute a test for each one. Each test case can use different sitespeed.io params.

```
{
  "baseUrl": "http://mochajs.org",
  "mochaTimeout": 120000,
  "testCases": [
    {
      "pathname": "/",
      "budget": {
        "rules": {
          "criticalpath": 63,
          "spof": 90,
          "cssnumreq": 90,
          "cssimagesnumreq": 90,
          "jsnumreq": 90,
          "yemptysrc": 90,
          "ycompress": 66,
          "ycsstop": 90,
          "yjsbottom": 90,
          "yexpressions": 90,
          "ydns": 24,
          "yminify": 89,
          "redirects": -1,
          "noduplicates": 88,
          "yetags": 22,
          "yxhr": 90,
          "yxhrmethod": 90,
          "mindom": 90,
          "yno404": 90,
          "ymincookie": 90,
          "ycookiefree": 35,
          "ynofilter": 90,
          "avoidscalingimages": 90,
          "yfavicon": 90,
          "thirdpartyasyncjs": 90,
          "cssprint": 90,
          "cssinheaddomain": 79,
          "syncjsinhead": 89,
          "avoidfont": 39,
          "totalrequests": 73,
          "expiresmod": -1,
          "longexpirehead": -1,
          "nodnslookupswhenfewrequests": 90,
          "inlinecsswhenfewrequest": 90,
          "textcontent": 5,
          "thirdpartyversions": 90,
          "ycdn": -1,
          "connectionclose": -1,
          "privateheaders": 89
        }
      }
    }
  ]
}
```