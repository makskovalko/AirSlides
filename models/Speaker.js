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

var SpeakerSchema = new Schema({
    email: String,
    password: String,
    displayName: String,
    provider: {
        name: String,
        userId: String
    }
});

SpeakerSchema.plugin(autoIncrement.plugin, {
    model: 'Speaker',
    startAt: 1,
    incrementBy: 1,
    field: '_id'
});

SpeakerSchema.methods.checkUserData = function(cb) {
    return this.model('Speaker').findOne({ email: this.email }, cb);
};

SpeakerSchema.methods.getRegisteredSpeaker = function(cb) {
    return this.model('Speaker').findOne({ $and: [ { email: this.email }, { password: this.password } ] }, cb);
};

var Speaker = connection.model('Speaker', SpeakerSchema);

module.exports = Speaker;