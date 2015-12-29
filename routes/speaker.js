var express = require('express');
var router = express.Router();
var md5 = require('md5');
var session = require('express-session');
var Speaker = require('../models/Speaker');
var speakerDTO = require('../dto/speakerDTO');
var Presentation = require('../models/Presentation');

router.post('/sign_up', function(req, res) {
    console.log(req.body.data);
    var inputSpeaker = JSON.parse(req.body.data);
    inputSpeaker.password = md5(inputSpeaker.password);

    var speaker = new Speaker(inputSpeaker);
    console.log(speaker);

    speaker.checkUserData(function(err, data) {
        if (err) console.log(err);
        if (!data)
            speaker.save(function (err) {
                if (err) console.log(err);
                if (!req.session.speaker) req.session.speaker = speaker;
                console.log(req.session.speaker);
                res.json(speakerDTO.convertToSpeakerDTO(speaker));
            });
        else {
            res.writeHead(409);
            res.end("User with same data already exists!");
        }
    });
});

router.post('/sign_in', function(req, res) {
    console.log(req.body.data);
    var inputSpeaker = JSON.parse(req.body.data);
    inputSpeaker.password = md5(inputSpeaker.password);

    var speaker = new Speaker(inputSpeaker);
    console.log(speaker);

    speaker.getRegisteredSpeaker(function(err, data) {
        if (err) {
            console.log(err);
            res.end("Incorrect data! Try again!");
        }
        if (!req.session.speaker) req.session.speaker = speaker;
        console.log(data);
        if (data) res.json(speakerDTO.convertToSpeakerDTO(data));
        else res.end("Incorrect data! Try again!");
    });
});

router.get('/log_out', function(req, res) {
    if (req.session.speaker) {
        delete req.session.speaker;
        res.end("OK");
    } else if (req.user) {
        req.logout();
        delete req.user;
        res.end("OK");
    }
    else res.end("fail");
});

router.get('/all', function(req, res) {
    Speaker.find({}, function(err, speakers) {
        res.json(speakers);
    });
});

router.get('/:speaker_id', function(req, res) {
    var id = req.params['speaker_id'];
    Speaker.findById(id, function(err, data) {
        res.json(data);
    })
});

router.get('/profile', function(req, res) {
    console.log("QWEQUYWETIUQWYTEIQUWYTEIUQWTYEIUQWE");
    res.json(req.user);
    //res.json(req.session.passport.user);
});

router.get('/all_presentations', function(req, res) {
    var userId;
    if (req.session.user) userId = req.session.user.id;
    else if (req.user) userId = req.user.id;
    console.log(userId);

    var presentation = new Presentation({ userId: userId });
    Presentation.getAllPresentationsBySpeaker(function(err, data) {
        console.log(data);
    });
});

module.exports = router;