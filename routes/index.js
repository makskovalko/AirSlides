var express = require('express');
var router = express.Router();
var fs = require('fs');
var Message = require('../models/Message');
var Presentation = require('../models/Presentation');
var Slide = require('../models/Slide');

router.get('/', function(req, res, next) {
    res.render('client');
});

router.get('/fail', function(req, res, next) {
    res.end("Authorization failed!");
});

router.get('/presentations/:id/:file', function(req, res) {
    var image = fs.readFile('./presentations/' + req.params.id + '/' + req.params.file, function(err, data) {
        if (err) console.log(err);
        res.writeHead(200, {'Content-Type': 'image/png' });
        res.end(data, 'binary');
    });
});

router.get('/all_presentations', function(req, res) {
    var id = req.query.id;
    Presentation.find({ user_id: id }, function(err, data) {
        if (err) console.log(err);
        if (data) {
            console.log(data);
            res.json(data);
        }
    });
});

router.post('/all_questions', function(req, res) {
    var presId = parseInt(req.body.id);
    console.log("Presentation id: " + presId);
    Presentation.findOne({ _id: presId }, function(err, data) {
        if (err) console.log(err);
        if (data) {
            var token = data.token;
            Message.find({ token: token }, function(err, questions) {
                if (err) console.log(err);
                if (questions) {
                    console.log(questions);
                    res.json(questions);
                }
            });
        } else {
            console.log("No fucking presentation with that id!");
        }
    });
});

router.post('/all_stats', function(req, res) {
    var presId = parseInt(req.body.id);
    var result = {};
    result.likes = [];
    result.dislikes = [];
    Presentation.findOne({ _id: presId }, function(err, data) {
        if (err) console.log(err);
        if (data) {
            Slide.find({ presentation_id: presId }, function(err, slides) {
                if (err) console.log(err);
                result.num_of_slides = slides.length;
                slides.forEach(function(slide) {
                    result.likes.push(slide.likes);
                    result.dislikes.push(slide.dislikes);
                });
                res.json(result);
            });
        }
    });
});

module.exports = router;