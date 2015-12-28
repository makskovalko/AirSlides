module.exports.convertToSpeakerDTO = function(speaker) {
    var newSpeaker = {
        id: speaker._id,
        name: speaker.displayName,
        //email: speaker.email,
        //password: speaker.password,
        //provider: speaker.provider
    };

    return newSpeaker;
};