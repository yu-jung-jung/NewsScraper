//dependenciesvar express = require("express");
var express = require("express");
var router = express.Router();
var request = require("request");
var cheerio = require("cheerio");
var mongoose = require("mongoose");

mongoose.Promise = Promise;

var Note = require("../models/Note.js");
var Article = require("../models/Article.js");

router.get("/", function(req, res){

	res.render("index");
});

router.get("/savedarticles", function(req, res) {

	Article.find({}, function(err, data) {
		if(err) {
			console.log(err);
		}
		else{
			var articleObj = {
				articles: data
			}

			res.render("savedarticles", articleObj);
		}
	});
});


router.post("/scraped", function(req, res){

	request("http://www.nytimes.com/", function(err, res, html) {

		var $ = cheerio.load(html);

		var articleArr = [];
		//{}
		$("article h3").each(function(i, element){
			var result = {};
			result.title = $(this).children("a").attr("href");

			articleArr[i] = result;

		});

		console.log(articleArr);

		var articleObj = {

			articles: articleArr
		};

		res.render("index", articleObj);

	});
});

router.post("saved", function(req, res) {

	console.log(req.body.title)

	var newarticleObj = {};

	newarticleObj.title = req.body.title;
	newarticleObj.link = req.body.link;

	var select = new Article(newarticleObj);

	console.log(select)

	select.save(function(err, result) {

		if(err){
			console.log(err)

		}else{
			console.log(result)
		}
	});

	res.redirect("/savedarticles")
});

router.get("/delete/:id", function(req, res) {
	consol.log(req.params.id);

	Article.remove({"_id": req.params.id}, function(err, data) {
		if(err){
			console.log(err)
		}
		else{
			console.log("delete")
		}
		res.redirect("/savedarticles")
	});
});

router.get("/notes/:id", function(req, res) {
	console.log(req.params.id);

	Note.remove({"_id": req.params.id}, function(err, data){
		if(err){
			console.log(err)
		}
		else{
			console.log("delete")
		}
	res.send(data);
	})
});

router.get("/articles/:id", function(req, res){
	console.log(req.params.id);

	Article.find({"_id": req.params.id})

	.populate('notes')

	.exec(function (err, data) {
		if(err){
			console.log(err)
		}
		else{
			console.log(data)
			res.json(data);
		}
	})
});


router.post("/articles/:id", function(req,res){

var newNote = new Note(req.body);

newNote.save(function (err, data) {
	if(err){
		console.log(err)
	}
	else{
		Article.update({"_id": req.params.id}, {$push: {notes: doc._id}}, {new: true, upsert: true})
		
		.populate('notes')
		.exec(function(err, data){
			if(err){
				console.log(err)
			}
			else{
				console.log(doc.notes);
				res.send(doc);
			}
		})
	}

});

})

module.exports = router;