// Require dependencies
var Article = require('../models/Article');
var Note = require('../models/Note');
var cheerio = require('cheerio');
var request = require('request');

modules.exports = function(app) {
	app.get('/', function(req, res) {
		res.render('home');
		

	})
}