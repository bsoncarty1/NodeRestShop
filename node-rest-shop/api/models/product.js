const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    price: {type: Number, required: true} //makes sure that the price is a number and it is present in the request
});

module.exports = mongoose.model('Produce', productSchema);