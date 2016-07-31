var sitespeedUtil = require('../lib/sitespeed-utils');
var expect = require('chai').expect;

// invoke performance budget mocha test
describe('Sitespeed Utils Test', function() {
    // load config from a file（path can be specified）
    var config = require('./config/mocha-budget.json');

    // add new parameter(s) dynamically (if needed for things like authentication cookies)
    // config.requestHeaders = {Cookie: cookie};

    // Determine the mochaTimeout threshold
    var mochaTimeout = (typeof config.mochaTimeout === 'number' && config.mochaTimeout) || 120000;

    // Need to bump up time for the Sitespeed tests
    this.timeout(mochaTimeout);

    // performanceBudgetTest
    it('performanceBudgetTest', function() {
        return sitespeedUtil.mochaBudgetTest(config).then(
    		function(results) {
                expect(results).to.be.undefined;
    		},
    		function(errors) {
                if (typeof errors === 'number') {
    			 expect(errors).to.be.equal(0);
                } else {
                    expect(errors).to.be.null;
                }
    		}
    	);
    });
    
    // now, test the "run" function...
    
    // get new config
    var sitespeedConfig = require('./config/sitespeed.json');

    // add new parameter(s) dynamically (if needed for things like authentication cookies)
    // sitespeedConfig.requestHeaders = {Cookie: cookie};
    
    it('run', function() {
        return sitespeedUtil.run(sitespeedConfig).then(
            function(data) {
                // Let's inspect a small part of the massive amount of data in results
                var result = data.result;
                var numPages = (result.pages && result.pages.length) ? result.pages.length : 0;
                expect(numPages).to.be.above(0);
            },
            function(errors) {
                expect(errors).to.be.null;
            }
        );
    });
});