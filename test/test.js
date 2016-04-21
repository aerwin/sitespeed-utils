'use strict';

var url = require('url');
var expect = require('chai').expect;
var objectAssign = require('object-assign');
var format = require('string-format');
var rimraf = require("rimraf");
var fs = require('fs');
var common = require('../lib/common')

/*rimraf('sitespeed-result', function(err) {
    console.log("delete legacy test data success")
});
*/

var path1 = __dirname + '/../../../config/budget-testcases.json';
var path2 = __dirname + '/../config/budget-testcases.json';
var config = process.env.BUDGET_TESTCASES;
if (!config) {
    if (fs.existsSync(path1)) {
        console.log("test case config path is " + path1)
        try {
            config = require(path1);
        } catch (e) {
            console.dir(e);
            console.error('Error loading budget test case file ' + path1);
            process.exit(1);
        }
    } else if (fs.existsSync(path2)) {
        console.log("test case config path is " + path2)
        try {
            config = require(path2);
        } catch (e) {
            console.dir(e);
            console.error('Error loading budget test case file ' + path2);
            process.exit(1);
        }
    } else {
        console.error('please configure test case file in ' + path1 + ' or ' + path2);
        process.exit(1);
    }
}
var baseUrl = config.baseUrl;
var testCases = config.testCases;
if (!baseUrl) {
    console.error('Error find base url');
    process.exit(1);
}

if (!testCases || testCases.length === 0) {
    console.error('Error find test case(s)');
    process.exit(1)
}

// Default options for all of the urls
var baseOptions = {
    depth: '0', // To set to 0, needs to be a string,
    showFailedOnly: false,
    budget: {
        rules: {}
    },
};

function buildUrl(baseUrl, urlParams, pathname) {
    var urlObj = url.parse(baseUrl);
    urlObj.query = urlParams;
    if (pathname) {
        urlObj.pathname = pathname;
    }
    return url.format(urlObj);
}

describe('Sitespeed Budgets', function() {
    // Need to bump up time for the Sitespeed tests
    this.timeout(60000);
    // Loop through the test data
    testCases.forEach(function(test) {
        var urlStr = buildUrl(baseUrl, test.urlParams, test.pathname);
        var options = objectAssign({}, baseOptions, {
            url: urlStr,
            budget: test.budget
        });
        var sitespeedData;
        describe(format('Run Sitespeed for {url}', {
            url: urlStr
        }), function() {
            beforeEach(function() {
                return common.run(options).then(
                    function(data) {
                        sitespeedData = data;
                    });
            });
            it(format('Test budgets for {url}', {
                url: urlStr
            }), function() {
                var budget = sitespeedData.budget;
                var showFailedOnly = options.showFailedOnly;
                describe(format('individual rules for {url}', {
                    url: urlStr
                }), function() {
                    if (budget) {
                        budget.forEach(function(item) {
                            if (!item.skipped) {
                                it(format('{id} goal: {limit}', item), function() {
                                    expect(item.value).to.be.above(item.limit);
                                });
                            }
                        });
                    }
                });
            });
        });
    });
});