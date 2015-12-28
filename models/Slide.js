var mongoose = require('mongoose');
var connection = mongoose.createConnection('mongodb://localhost/airslides');
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