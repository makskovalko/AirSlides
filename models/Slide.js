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

var SlideSchema = new Schema({
    presentation_id: Number,
    likes: Number,
    dislikes: Number
});

SlideSchema.plugin(autoIncrement.plugin, {
    model: 'Slide',
    startAt: 1,
    incrementBy: 1,
    field: '_id'
});




var Slide = connection.model('Slide', SlideSchema);

module.exports = Slide;