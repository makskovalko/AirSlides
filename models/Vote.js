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

var VoteSchema = new Schema({
    slide_no: Number,
    token: String,
    vote: String
});

VoteSchema.plugin(autoIncrement.plugin, {
    model: 'Vote',
    startAt: 1,
    incrementBy: 1,
    field: '_id'
});




var Vote = connection.model('Vote', VoteSchema);

module.exports = Vote;