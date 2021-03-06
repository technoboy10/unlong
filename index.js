#!/usr/bin/env node
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var http = express();
http.use(bodyParser.urlencoded({extended: false}));
var db = JSON.parse(fs.readFileSync('db.json'));
var index = fs.readFileSync('index.html');

var r = require('random-js');
var port = process.env.PORT || 8080

http.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

http.post('/create', function(req, res){
	console.log(req.body.url);
	var id = r.string()(r.engines.mt19937().autoSeed(), 5);
	while (db.hasOwnProperty(id)){
		var id = r.string()(r.engines.mt19937().autoSeed(), 5);
	}
	db[id] = req.body.url;
	fs.writeFileSync('db.json', JSON.stringify(db));
	res.redirect('/new/' + id);
});

http.get('/new/:id', function(req, res){
	res.sendFile(__dirname + '/new.html');
});

http.get('/no/:id', function(req, res){
	res.sendFile(__dirname + '/no.html');
});
http.get('/:id', function(req, res){
	if(db.hasOwnProperty(req.params.id)){
		res.redirect(db[req.params.id]);
	} else {
		res.redirect('/no/' + req.params.id);
	}
});

http.listen(port);

