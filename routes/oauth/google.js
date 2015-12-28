module.exports = function(app, passport, speakerDTO) {

    app.get('/auth/google', passport.authenticate('google', { scope : ['email', 'profile'] }));

    app.get('/auth/google/callback',
        passport.authenticate('google'), function(req, res) {
            res.json(speakerDTO.convertToSpeakerDTO(req.user));
        }
    );

    app.get('/auth/google/jsondata', function(req, res) {
        res.json(req.user);
    });
};