module.exports = function(app, passport, speakerDTO) {

    app.get('/auth/linkedin', passport.authenticate('linkedin', { scope : ['r_basicprofile', 'r_emailaddress'] }));

    app.get('/auth/linkedin/callback',
        passport.authenticate('linkedin'), function(req, res) {
            res.json(speakerDTO.convertToSpeakerDTO(req.user));
        }
    );

    app.get('/auth/linkedin/jsondata', function(req, res) {
        res.json(req.user);
    });
};