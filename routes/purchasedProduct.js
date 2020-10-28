const express = require('express');
const PurchaseProduct = require('../models/purchaseProduct');
const Product = require('../models/createProduct');
const requireLoggedIn = require('../middleware/requireLoggedIn');
const purchasedRouter = express.Router();

purchasedRouter.route('/:_id').get(requireLoggedIn,(req, res) => {
    const product_id = req.params._id
    PurchaseProduct.findById(product_id, (error, product) => {
        if (error) return console.log(error);
        else return console.log('Product is :', product);
    })
        .then(res => res.json({ product: res }))
        .catch(err => res.json({ Error: err }));
})

purchasedRouter.route('/delete/:_productName/:_user/:_quantity').delete(requireLoggedIn,(req,res)=>{
    const productName = req.params._productName;
    const user = req.params._user;
    const quantity = req.params._quantity;


    PurchaseProduct.findOne({ productName: productName, userName: user, quantity: quantity }, function (err, result) {
        if (err) {
            return res.send(err);
        }
        // res.send(result)
        PurchaseProduct.findByIdAndDelete(result._id)
                        .then(response => res.json({message : response.productName}))
                        .catch(error => res.status(400).json({error : error}))
    })
    
})

purchasedRouter.route('/update/:_productName/:_user/:_quantity').post(requireLoggedIn,(req, res) => {
    const productName = req.params._productName;
    const user = req.params._user;
    const quantity = req.params._quantity;
    // console.log('Inside Update model', product_id);
    // const {productName, quantity} = req.body;
    console.log('ProductName : ', productName,user,quantity);


    // const {newProductName, quantity} = req.body;


    PurchaseProduct.findOne({ productName: productName, userName: user, quantity: quantity }, function (err, result) {
        if (err) {
            return res.send(err);
        }

        // res.send(result);
        Product.findOne({ name: productName }, function (err, response) {
            if (err) {
                return res.send(err)
            }
            
            res.send(response);
            PurchaseProduct.findById(result._id)
                .then(purchasedProduct => {
                        purchasedProduct.productName = req.body.productName,
                        purchasedProduct.quantity = req.body.quantity,
                        purchasedProduct.totalPrice = req.body.quantity * response.price
                        // console.log('purchased', purchasedProduct);
                        
                        purchasedProduct.save()
                                        .then(() => res.json("Successfully Updated"))
                                        .catch((err) => res.json({Error: err}))
                })
                .catch(err => res.json(err))


        })


    });
})

module.exports = purchasedRouter;