var Sitespeed = require('sitespeed.io/lib/sitespeed');
var common = require('./common');
var Mocha = require('mocha');
var fs = require('fs');
var path = require('path');
spUtilsCfg = {};

function checkBudget(budget, showFailedOnly) {
	common.checkBudget(budget, showFailedOnly);
}

function run(options) {
	return common.run(options);
}

function performanceBudgetTest(cfg) {
	if (!cfg) {
		console.error('parameter cfg is invalid');
		process.exit(1);
	}
	spUtilsCfg = cfg;

	// Instantiate a Mocha instance.
	var mocha = new Mocha();

	var testDir = __dirname + '/../test/';

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
		process.on('exit', function() {
			process.exit(failures); // exit with non-zero status if there were failures
		});
	});

}

exports.run = run;
exports.checkBudget = checkBudget;
exports.performanceBudgetTest = performanceBudgetTest;