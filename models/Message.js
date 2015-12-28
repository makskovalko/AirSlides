var mongoose = require('mongoose');
var connection = mongoose.createConnection('mongodb://localhost/airslides');
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