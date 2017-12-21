// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");

mongoose.Promise = Promise;

var PORT = process.env.PORT || 3000;

var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
	extended: false
}));

app.use(express.static("public"));

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main"}));
app.set ("view engine", "handlebars");

var routes = require("./controller/controller.js");

app.use("/", routes);

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
  useMongoClient: true
});

//mongoose.connect('mongodb://localhost/myapp');
// mongoose.connect("	")
// var db = mongoose.connection;

// db.on("error", function(err) {
// 	console.log(err)
// })

// db.once("open", function(){
// 	console.log("connected")
// })

app.listen(PORT, function() {
	console.log("App running on PORT " + PORT)
});