var express = require('express');
var router = express.Router();
var Presentation = require('../models/Presentation');
var SlidesDownloader = require('../service/slidesDownloader');
var Slide = require('../models/Slide');
var fs = require('fs');

router.post('/google/create', function(req, res) {

    var obj = req.body;
    obj.slides_ids = obj.slides_ids.split(' ');

    console.log(obj.slides_ids.join(' '));
    console.log(req.body.slides_ids);

    obj.token = Presentation.generateToken();
    var presentation = new Presentation(obj);
    //console.log(presentation);
    var slidesDownloader = new SlidesDownloader();
    var path;

    var presId = presentation.presentation_url.split('/')[5];
    //var query = Presentation.findOne({ "presentation_url": new RegExp(presId, 'i') });
    var query = Presentation.findOne({ $and: [ { "user_id" : presentation.user_id }, { "presentation_url" : new RegExp(presId, 'i') }] });
    query.exec(function(err, data) {
        if (err) console.log(err);
        if (data) {
            path = './presentations/' + data.id;
            console.log("DATA" + data);

            fs.exists('./presentations/' + data.id, function(exists) {
                if (exists) {
                    Slide.remove({ presentation_id: data.id }, function(err) {
                        if (err) console.log(err);
                    });

                    data.save(function(err) {
                        if (err) console.log(err);
                        if (!path) path = './presentations/' + data.id;
                        slidesDownloader.downloadGoogleSlidesPNG(data, res, path);
                        res.json(data.token);
                    });
                }
            });

        } else {
            console.log("NO DATA");
            presentation.save(function(err) {
                if (err) console.log(err);
                if (!path) path = './presentations/' + presentation.id;
                slidesDownloader.downloadGoogleSlidesPNG(presentation, res, path);

                res.json(presentation.token);
            });

        }
    });

});

router.post('/slideshare/create', function(req, res) {
    var obj = req.body;
    obj.token = Presentation.generateToken();
    var presentation = new Presentation(obj);
    var slidesDownloader = new SlidesDownloader();

    var query = Presentation.findOne({ $and: [ { "user_id" : presentation.user_id }, { "presentation_url" : presentation.presentation_url }] });
    query.exec(function(err, data) {
        if (data) {
            /*
            if (err) console.log(err);
            slidesDownloader.downloadSlideshareSlides(data.presentation_url, req, res, function (images) {
                images = images.map(function (item) {
                    return item.imageNormal; //For better quality choose imageFull;
                });

                data.presentation_name = obj.presentation_name;
                data.slides_ids = images;
                data.save(function (err) {
                    if (err) console.log(err);
                    res.json(data.token);
                });
            });
            */
        } else {
            slidesDownloader.downloadSlideshareSlides(presentation.presentation_url, req, res, function(images) {
                images = images.map(function (item) {
                    return item.imageNormal; //For better quality choose imageFull;
                });
                presentation.slides_ids = images;

                presentation.save(function(err, presentation) {
                    Slide.find({ presentation_id: presentation._id }, function(err, slides) {

                        for (var i = 0; i < presentation.slides_ids.length; i += 1) {
                                var slide = new Slide({
                                    name: (i + 1) + '.png',
                                    presentation_id: presentation._id,
                                    likes: 0,
                                    dislikes: 0
                                });
                                slide.save(function (err) {
                                    if (err) console.log(err);
                                });
                            }
                    });
                    if (err) console.log(err);
                    res.json(presentation.token);
                });
            });
        }
    });

});

module.exports = router;