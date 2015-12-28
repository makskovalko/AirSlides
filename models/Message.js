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

var MessageSchema = new Schema({
    sender_name: String,
    question: String,
    token: String
});

MessageSchema.plugin(autoIncrement.plugin, {
    model: 'Message',
    startAt: 1,
    incrementBy: 1,
    field: '_id'
});




var Message = connection.model('Message', MessageSchema);

module.exports = Message;