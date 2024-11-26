const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerID: {
        type: mongoose.Schema.Types.ObjectId, // Corrected to Schema.Types
        required: true
    },
    bookID: {
        type: mongoose.Schema.Types.ObjectId, // Corrected to Schema.Types
        required: true
    },
    initialDate: {
        type: Date,
        required: true
    },
    deliveryDate: {
        type: Date,
        required: false
    }
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;