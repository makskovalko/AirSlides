var mongoose = require('mongoose');
var connection = mongoose.createConnection('mongodb://localhost/airslides');
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