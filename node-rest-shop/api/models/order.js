const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},//links the product that is being ordered from product.js
    quantity: { type: Number, default: 1}
});

module.exports = mongoose.model('Order', orderSchema);