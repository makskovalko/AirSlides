'use strict';

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var SlidesDownloader = require('../service/slidesDownloader');

router.post('/slideshare_link', (req, res) => {
    //console.log(req.body.link);
    var link = req.body.link;
    var slidesDownloader = new SlidesDownloader();
    slidesDownloader.downloadSlideshareSlides(link, req, res);
});

module.exports = router;