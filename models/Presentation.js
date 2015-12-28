var mongoose = require('mongoose');
//var connection = mongoose.createConnection('mongodb://localhost/airslides');

var options = {
    db: { native_parser: true },
    server: { poolSize: 5 },
    replset: { rs_name: 'myReplicaSetName' },
    user: 'admin',
    pass: 'X6HbdLX6k75R'
};

var connection = mongoose.createConnection('mongodb://$OPENSHIFT_MONGODB_DB_HOST:$OPENSHIFT_MONGODB_DB_PORT/airslides', options);

var autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(connection);

var Schema = mongoose.Schema;

var PresentationSchema = new Schema({
    presentation_name: String,
    presentation_url: String,
    user_id: Number,
    token: String,
    source: String,
    slides_ids: []
});

PresentationSchema.plugin(autoIncrement.plugin, {
    model: 'Presentation',
    startAt: 1,
    incrementBy: 1,
    field: '_id'
});

PresentationSchema.methods.getAllPresentationsBySpeaker = function(cb) {
    return this.model('Presentation').find({ user_id: this.user_id });
};

PresentationSchema.methods.getPresentationByToken = function(cb) {
    return this.model('Presentation').find({ token: this.token });
};

PresentationSchema.methods.getPresentationByURL = function(cb) {
    return this.model('Presentation').find({ presentation_url: this.presentation_url });
};

PresentationSchema.statics.getSlidesByToken = function(cb) {
    return this.model('Presentation').findOne({ token: this.token });
};

PresentationSchema.statics.generateToken = function generateToken() {
    var symbols = "qwertyuioopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM0123456789";
    var arr = symbols.split('');
    var result = "";
    for (var i = 0; i < 4; i++) {
        var rand = Math.floor(Math.random() * arr.length);
        result += arr[rand];
    }
    console.log("presentation token: " + result);

    return result;
};

PresentationSchema.statics.getFirstSlide = function getFirstSlide(token) {
    return this.model('Presentation').findOne({ token: token });
};

var Presentation = connection.model('Presentation', PresentationSchema);

module.exports = Presentation;