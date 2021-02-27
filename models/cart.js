const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    userName : {
        type : String,
        require : true
    },
    products : {
        type : [],
        require : true
    },
    total : 0
})

const Cart = mongoose.model("Cart",cartSchema);

module.exports = Cart;