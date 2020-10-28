const express = require('express');

const productRouter = express.Router();

const Product = require('../models/createProduct');
const requireLoggedIn = require('../middleware/requireLoggedIn');

productRouter.route('/').get((req, res) => {
    Product.find()
            .then(product => res.json(product))
            .catch(err => res.status(400).json({error : err}));
})

productRouter.route('/price/:name').get((req, res) => {
    let name = req.params.name;
    
    Product.findOne({'name' : name},'price',function(err,docs){
        if (err){ 
            console.log(err) 
        } 
        else{ 
            console.log("Result : ", docs); 
        } 
    })
    .then(productName => res.json(productName.price))
    .catch(err => res.status(400).json({error : err}));
})

productRouter.post('/createproduct',requireLoggedIn, (req, res) => {
    const {name, stock, price} = req.body;
    // console.log(name, stock, price);
    
    if(!name || !stock || !price){
        return res.status(404).json({error : "plz fill all required fields..."});
    }

    const product = Product({
        name,stock,price
    })

    product.save()
           .then(response => res.json({message : "Product successfully created!!"}))
           .catch(err => res.json({error : err}));

})

module.exports = productRouter;