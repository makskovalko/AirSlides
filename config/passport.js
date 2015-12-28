var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var LinkedInStrategy = require('passport-linkedin').Strategy;

var Speaker = require('../models/Speaker');
var configAuth = require('../config/auth');

module.exports = function(passport) {

    passport.serializeUser(function(speaker, done) {
        done(null, speaker);
    });

    passport.deserializeUser(function(id, done) {
        Speaker.findOne(id, function(err, speaker) {
            done(err, speaker);
        });
    });

    passport.use(new FacebookStrategy({
            clientID: configAuth.facebookAuth.clientID,
            clientSecret: configAuth.facebookAuth.clientSecret,
            callbackURL: configAuth.facebookAuth.callbackURL,
            profileFields: ['emails', 'displayName']
        }, function(accessToken, refreshToken, profile, done) {
            process.nextTick(function() {
                //console.log(profile);
                Speaker.findOne({'provider.userId': profile.id, 'provider.name' : 'facebook'}, function (err, speaker) {
                    if (speaker) {
                        console.log(JSON.stringify(speaker));
                        return done(null, speaker);
                    }
                    else {
                        speaker = new Speaker();
                        speaker.provider.userId = profile.id;
                        speaker.provider.name = profile.provider;
                        speaker.email = profile.emails[0].value;
                        speaker.displayName = profile.displayName;
                        speaker.save(function (err) {
                            if (err) console.log(err);
                            console.log(JSON.stringify(speaker));
                            return done(null, speaker);
                        });
                    }
                });
            });
        }
    ));

    passport.use(new GoogleStrategy({
            clientID: configAuth.googleAuth.clientID,
            clientSecret: configAuth.googleAuth.clientSecret,
            callbackURL: configAuth.googleAuth.callbackURL
        }, function(accessToken, refreshToken, profile, done) {
            process.nextTick(function() {
                //console.log(profile);
                Speaker.findOne({'provider.userId': profile.id, 'provider.name': 'google'}, function (err, speaker) {
                    if (speaker) {
                        console.log(JSON.stringify(speaker));
                        return done(null, speaker);
                    }
                    else {
                        speaker = new Speaker();
                        speaker.provider.userId = profile.id;
                        speaker.provider.name = profile.provider;
                        speaker.email = profile.emails[0].value;
                        speaker.displayName = profile.displayName;
                        speaker.save(function (err) {
                            if (err) console.log(err);
                            console.log(JSON.stringify(speaker));
                            return done(null, speaker);
                        });
                    }
                });
            });
        }
    ));

    passport.use(new LinkedInStrategy({
            consumerKey: configAuth.linkedInAuth.clientID,
            consumerSecret: configAuth.linkedInAuth.clientSecret,
            callbackURL: configAuth.linkedInAuth.callbackURL,
            profileFields: ['id', 'email-address', 'first-name', 'last-name']
        }, function(accessToken, refreshToken, profile, done) {
            process.nextTick(function() {
                //console.log(profile);
                Speaker.findOne({'provider.userId': profile.id, 'provider.name': 'linkedin'}, function (err, speaker) {
                    if (speaker) {
                        console.log(JSON.stringify(speaker));
                        return done(null, speaker);
                    }
                    else {
                        speaker = new Speaker();
                        speaker.provider.userId = profile.id;
                        speaker.provider.name = profile.provider;
                        speaker.email = profile.emails[0].value;
                        speaker.displayName = profile.displayName;
                        speaker.save(function (err) {
                            if (err) console.log(err);
                            console.log(JSON.stringify(speaker));
                            return done(null, speaker);
                        });
                    }
                });
            });
        }
    ));

};