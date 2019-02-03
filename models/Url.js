const mongoose = require('mongoose');
const autoIncrement = require("mongoose-auto-increment");

autoIncrement.initialize(mongoose.connection);

const UrlSchema = new mongoose.Schema({
    orig_url: {
        type: String,
        required: true
    },
    short_url: {
        type: Number,
        required: true
    }
});

UrlSchema.plugin(autoIncrement.plugin, {model: 'Url', field: 'short_url'} );
const Url = mongoose.model('Url', UrlSchema);

module.exports = Url;