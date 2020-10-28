const mongoose = require('mongoose');

const purchaseProductSchema = mongoose.Schema({
    userName : {
        type : String,
        require : true
    },
    productName : {
        type : String,
        require : true
    },
    quantity : {
        type: Number,
        require : true
    },
    totalPrice : {
        type : Number,
        require : true
    },
})

const PurchaseProduct = mongoose.model("PurchaseProduct",purchaseProductSchema);

module.exports = PurchaseProduct;