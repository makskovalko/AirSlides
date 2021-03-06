var mongoose = require('mongoose');
var connection = mongoose.createConnection('mongodb://localhost/airslides');
/*
var options = {
    db: { native_parser: true },
    server: { poolSize: 5 },
    replset: { rs_name: 'myReplicaSetName' },
    user: 'admin',
    pass: 'X6HbdLX6k75R'
};

var connection_string = '127.0.0.1:27017/airslides';
// if OPENSHIFT env variables are present, use the available connection info:
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
    connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
        process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
        process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
        process.env.OPENSHIFT_APP_NAME;
}

var connection = mongoose.createConnection(connection_string, options);*/

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