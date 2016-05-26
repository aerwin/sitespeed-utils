var Sitespeed = require('sitespeed.io/lib/sitespeed');
var chalk = require('chalk');
var format = require('string-format');
var Mocha = require('mocha');
var fs = require('fs');
var path = require('path');

/* Budget items look like:
 {
	"title": "connectionclose :Do not close the connection",
	"url": "https://sitespeed.io",
	"id": "connectionclose",
	"isOk": false,
	"description": "The connectionclose has the score 30",
	"value": 30,
	"components": [
		"http%3A%2F%2Fsuspended.hostgator.com%2Fimages%2Fhg728x90.swf%3FclickTAG%3Dhttp%3A%2F%2Fsecure.hostgator.com%2Fcgi-bin%2Faffiliates%2Fclickthru.cgi%3Fid%3Doffer404",
		"http%3A%2F%2Fsuspended.hostgator.com%2Fimages%2F404top.jpg",
		"http%3A%2F%2Fsuspended.hostgator.com%2Fimages%2F404mid.gif",
		"http%3A%2F%2Fsuspended.hostgator.com%2Fimages%2F404bottom.gif",
		"http%3A%2F%2Fsuspended.hostgator.com%2Fimages%2Fgatorbottom.png/",
		"http%3A%2F%2Fsuspended.hostgator.com%2Fimages%2Fx.png",
		"http%3A%2F%2Fsuspended.hostgator.com%2Fjs%2Fsimple-expand.min.js"
	],
	"type": "rule",
	"limit": 90
}
*/

exports.checkBudget = function(budget, showFailedOnly) {
	if (budget) {
		budget.forEach(function(item) {
			// AWE TODO: Handle skipped
			if (!item.skipped) {
				if (item.isOk) {
					if (!showFailedOnly) {
						console.log(chalk.green(format('PASS {id}: {value} > {limit}', item)));
					}
				} else {
					console.error(chalk.red(format('FAIL {id}: {value} < {limit}', item)));
					//console.error(chalk.red(JSON.stringify(item))); //AWE TODO
				}
			} else { // skipped
				if (!showFailedOnly) {
					console.log(format('SKIPPED {id}', item));
				}
			}
		});
	}
};

exports.run = function(options) {
	var self = this;
	var promise = new Promise(
		function(resolve, reject) {
			var sitespeed = new Sitespeed();
			sitespeed.run(options, function(err, data) {
				if (!err) {
					if (data.budget) {
						self.checkBudget(data.budget, options.showFailedOnly);
					}
					resolve(data);
				} else {
					reject(err);
				}
			});
		});
	return promise;
};