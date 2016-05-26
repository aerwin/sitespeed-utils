Convenience utility to run [sitespeed.io](https://www.sitespeed.io/) tests using ES6 promises.


# usage examples:

## run performance budget test using mocha

```
var spUtil = require('sitespeed-utils');

// load config from a file（path can be specified）
var config = require('./config/budget-testcases.json')

// add new parameter(s) dynamically if needed
config.requestHeaders = {Cookie: cookie}

// invoke performance budget mocha test
spUtil.performanceBudgetTest(config)
```

## budget-testcases.json example

```
{
  "baseUrl": "http://mochajs.org",
  "timeout": 120000,
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