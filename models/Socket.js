var mongoose = require('mongoose');
var connection = mongoose.createConnection('mongodb://localhost/airslides');
var autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(connection);

var Schema = mongoose.Schema;

var SocketSchema = new Schema({
    socket: Buffer,
    token: String
});

SocketSchema.plugin(autoIncrement.plugin, {
    model: 'Socket',
    startAt: 1,
    incrementBy: 1,
    field: '_id'
});




var Socket = connection.model('Socket', SocketSchema);

module.exports = Socket;