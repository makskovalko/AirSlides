var Presentation = require('../models/Presentation');
var Slide = require('../models/Slide');

var PresentationService = (function() {

    function getSlideByNumber(data, n, DOMAIN, callback) {
        var imageLink = '/presentations/' + data.id + '/' + n + '.png';
        return callback(DOMAIN + imageLink);
    }

    function getSlideShareSlideByNumber(data, n, DOMAIN, callback) {
        var imageLink = data.slides_ids[n - 1];
        return callback(imageLink);
    }

    function getPresentationSourceByToken(token, callback) {
        Presentation.findOne({token: token}, function (err, data) {
            if (err) console.log(err);
            return callback(data);
        });
    }

    function sendSlide(clients, token, slideNumber, DOMAIN) {

        getPresentationSourceByToken(token, function (data) {
            var getLink;

            if (data.source === "google") {
                getLink = getSlideByNumber;
            }
            else if (data.source === "slideshare") {
                getLink = getSlideShareSlideByNumber;
            }

            getLink(data, slideNumber, DOMAIN, function (link) {

                if (clients[token]) {
                    for (var i = 0; i < clients[token].length; i += 1) {
                        clients[token][i].emit('change_user_slide',
                            {
                                slide_number: slideNumber,
                                img_url: link
                            })
                    }
                }
                else {
                    console.log("There's no such client.");
                }
            });

        });
    }

    function saveSlideVote(vote, type) {
        Presentation.findOne({ token: vote.token }, function(err, presentation) {
            if (err) console.log(err);
            if (presentation) {
                Slide.find({ presentation_id: presentation._id }, function(err, slides) {
                    if (err) console.log(err);
                    if (slides) {
                        var slide = slides[vote.slide_no - 1];
                        if (type == "like")
                            Slide.findByIdAndUpdate(slide._id, { $inc: { likes: 1 } }, function(err, data) {
                                if (err) console.log(err);
                            });
                        else if (type == "dislike")
                            Slide.findByIdAndUpdate(slide._id, { $inc: { dislikes: 1 } }, function(err, data) {
                                if (err) console.log(err);
                            });
                    }
                })
            }
        });
    }

    return {
        getSlideByNumber: getSlideByNumber,
        getSlideShareSlideByNumber: getSlideShareSlideByNumber,
        getPresentationSourceByToken: getPresentationSourceByToken,
        sendSlide: sendSlide,
        saveSlideVote: saveSlideVote
    }
});

module.exports = PresentationService;