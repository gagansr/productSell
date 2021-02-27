const express = require('express');
const PurchaseProduct = require('../models/purchaseProduct');
const Product = require('../models/createProduct');
const requireLoggedIn = require('../middleware/requireLoggedIn');

const purchaseRouter = express.Router();

// let stock = 0;

// purchaseRouter.route('/').get((req, res) => {
//     Product.findOne({'name' : p}, 'stock', (error, product) => {
//         if(error) return res.json({error : error});
//         stock = product.stock
//         res.json({Stock : stock})
//     })
// })

purchaseRouter.route('/').post(requireLoggedIn,(req, res) => {
    const { userName, productName, quantity } = req.body;
    Product.findOne({ 'name': productName }, 'stock price', (error, product) => {
        if (error) return res.json({ error: error });
        console.log('Product : ',req.body);
        let stock = product.stock;
        


        if (!userName || !productName) {
            return res.status(404).json({ error: "plz select of all the fields " });
        } else if (quantity > stock) {
            return res.status(404).json({ error: "plz check stock before purchasing", stock });
        }
        let productPrice = (quantity * product.price);
        let remainingStock = product.stock - quantity;


        const purchaseProduct = PurchaseProduct({
            userName, productName, quantity,
            totalPrice: productPrice
        })

        purchaseProduct.save()
            .then(response => res.json({ message: "Successfully Added to Cart!!" }))
            .catch(err => res.json({ error: err }));

        Product.findByIdAndUpdate(product._id, { stock: remainingStock }, function (err, product) {
            if (err) {
                console.log(err)
            }
            else {
                console.log("Updated product : ", product);
            }
        });

    })


})

module.exports = purchaseRouter;