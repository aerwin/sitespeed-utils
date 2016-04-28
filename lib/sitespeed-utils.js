var Sitespeed = require('sitespeed.io/lib/sitespeed');
var common = require('./common')
var Mocha = require('mocha');
var fs = require('fs');
var path = require('path');
spUtilsCfg = {};



// Budget items look like:
// 
// 	{
//		"title": "connectionclose :Do not close the connection",
//		"url": "https://sitespeed.io",
//		"id": "connectionclose",
//		"isOk": false,
//		"description": "The connectionclose has the score 30",
//		"value": 30,
//		"components": [
//			"http%3A%2F%2Fsuspended.hostgator.com%2Fimages%2Fhg728x90.swf%3FclickTAG%3Dhttp%3A%2F%2Fsecure.hostgator.com%2Fcgi-bin%2Faffiliates%2Fclickthru.cgi%3Fid%3Doffer404",
//			"http%3A%2F%2Fsuspended.hostgator.com%2Fimages%2F404top.jpg",
//			"http%3A%2F%2Fsuspended.hostgator.com%2Fimages%2F404mid.gif",
//			"http%3A%2F%2Fsuspended.hostgator.com%2Fimages%2F404bottom.gif",
//			"http%3A%2F%2Fsuspended.hostgator.com%2Fimages%2Fgatorbottom.png/",
//			"http%3A%2F%2Fsuspended.hostgator.com%2Fimages%2Fx.png",
//			"http%3A%2F%2Fsuspended.hostgator.com%2Fjs%2Fsimple-expand.min.js"
//		],
//		"type": "rule",
//		"limit": 90
//	}
// 
function checkBudget(budget, showFailedOnly) {
	common.checkBudget(budget, showFailedOnly)
}

function run(options) {
	return common.run(options)
}

function performanceBudgetTest(cfg) {
	if (!cfg) {
		console.error('parameter cfg is invalid')
		process.exit(1)
	}
	spUtilsCfg = cfg;

	// Instantiate a Mocha instance.
	var mocha = new Mocha();

	var testDir = __dirname + '/../test/'

	console.log('scan dir ' + testDir)

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