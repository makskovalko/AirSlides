module.exports = function(app, passport, speakerDTO) {

    app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email'] }));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook'), function(req, res) {
            res.json(speakerDTO.convertToSpeakerDTO(req.user));
        }
    );

    app.get('/auth/facebook/jsondata', function(req, res) {
        res.json(req.user);
    });
};