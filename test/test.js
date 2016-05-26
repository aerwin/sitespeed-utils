'use strict';

var url = require('url');
var expect = require('chai').expect;
var objectAssign = require('object-assign');
var format = require('string-format');
var common = require('../lib/common');
var timeout = 60000;

var baseUrl = spUtilsCfg.baseUrl;
var testCases = spUtilsCfg.testCases;
var requestHeaders = spUtilsCfg.requestHeaders;

if (!baseUrl) {
    console.error('Error find base url');
    process.exit(1);
}

if (!testCases || testCases.length === 0) {
    console.error('Error find test case(s)');
    process.exit(1);
}
if ((spUtilsCfg.timeout) && (typeof spUtilsCfg.timeout === 'number')) {
    timeout = spUtilsCfg.timeout;
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
    this.timeout(timeout);
    // Loop through the test data
    testCases.forEach(function(test) {
        var urlStr = buildUrl(baseUrl, test.urlParams, test.pathname);
        var options = objectAssign({}, baseOptions, {
            url: urlStr,
            budget: test.budget
        });
        if (requestHeaders) {
            options.requestHeaders = requestHeaders;
        }
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