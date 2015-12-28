var Presentation = require('../models/Presentation');
var request = require('request');
var fs = require('fs');
var cheerio = require('cheerio');
var Slide = require('../models/Slide');

var SlidesDownloader = (function() {
    function downloadSlideshareSlides(link, req, res, callback) {
        var options = {
            url: link,
            headers: {
                'User-Agent': 'request'
            }
        };

        request(options, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                var $ = cheerio.load(body);
                var images = [];
                var counter = 0;
                $("img.slide_image").each(function () {
                    counter++;
                    images.push({
                        id: counter,
                        imageSmall: this.attribs['data-small'],
                        imageNormal: this.attribs['data-normal'],
                        imageFull: this.attribs['data-full']
                    });
                });
                //console.log(images);
                return callback(images);
                //res.end(JSON.stringify(images));
            } else res.status(500).end("Server Error!");
        });
    }


    function downloadGoogleSlidesPNG(presentation, res, path) {
        console.log(presentation.presentation_url);

        var download = function(uri, filename, callback) {
            request.head(uri, function(err, res, body) {
                //console.log('content-type:', res.headers['content-type']);
                console.log('content-length:', res.headers['content-length']);
                request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
            });
        };

        if (!fs.existsSync(path)) fs.mkdirSync(path);

        var link = presentation.presentation_url,
            parts = link.split('/'),
            presentationId = parts[5],
            baseUrl = "https://docs.google.com/presentation/d/" + presentationId + "/export/png?id=" + presentationId + "&pageid=";

        var chunks = [],
            delay = 15, // in seconds
            chunk_size = 30,
            i, j;

        for (i = 0, j = 0; i < presentation.slides_ids.length; i += chunk_size, j += 1) {
            chunks[j] = presentation.slides_ids.slice(i, i + chunk_size);
        }
        console.log(chunks);

        i = 0;
        for ( ; i < chunks.length; i += 1) {
            createDelay(i, chunks);
        }

        // Break up the request into chunks of 30 images each 15 seconds
        function createDelay(i, chunks) {
            setTimeout(function() {

                for (var j = 0; j < chunks[i].length; j +=1) {

                    var url = baseUrl + chunks[i][j];
                    console.log(url);

                    var slide = new Slide({
                        presentation_id: presentation.id,
                        likes: 0,
                        dislikes: 0
                    });

                    slide.save(function(err) {
                        if (err) console.log(err);
                    });

                    download(url, (path + '/' + (i*chunk_size + j + 1) + '.png'), function () {
                        console.log("+");
                    });

                }

                console.log("Requested ", chunks[i].length, "images.");

            }, delay * 1000 * i);
        }

    }

    return {
        downloadSlideshareSlides: downloadSlideshareSlides,
        downloadGoogleSlidesPNG: downloadGoogleSlidesPNG
    };

});

module.exports = SlidesDownloader;