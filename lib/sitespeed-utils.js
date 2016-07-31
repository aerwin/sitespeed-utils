var Sitespeed = require('sitespeed.io/lib/sitespeed');
var common = require('./common');
var Mocha = require('mocha');
var fs = require('fs');
var path = require('path');

function checkBudget(budget, showFailedOnly) {
	common.checkBudget(budget, showFailedOnly);
}

function run(options) {
	return common.run(options);
}

function mochaBudgetTest(cfg) {
	var promise = new Promise (
		function(resolve, reject) {
			if (!cfg) {
				var msg = 'parameter cfg is invalid';
				console.error(msg);
				reject(msg);
			}

			// Don't really like to do this, but it seems to be the only reasonable
			// way to provide some context for the Mocha test we're about to execute
			process.env._sitespeedUtilsPerformanceTestConfig = JSON.stringify(cfg);

			// Instantiate a Mocha instance.
			var mocha = new Mocha();

			var testDir = __dirname + '/mocha/';

			console.log('scan dir ' + testDir);

			// Add each .js file to the mocha instance
			fs.readdirSync(testDir).filter(function(file) {
				// Only keep the .js files
				return file.substr(-3) === '.js';

			}).forEach(function(file) {
				mocha.addFile(
					path.join(testDir, file)
				);
			});

			// Run the tests.
			mocha.run(function(failures) {
				if (!failures) {
					resolve();
				} else {
					reject(failures);
				};
			});
		});
	return promise;
}

exports.run = run;
exports.checkBudget = checkBudget;
exports.mochaBudgetTest = mochaBudgetTest;