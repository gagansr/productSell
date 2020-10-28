const express = require('express');
const User = require('../models/createUser');
const requireLoggedIn = require('../middleware/requireLoggedIn');
const userRouter = express.Router();

userRouter.route('/').get((req, res) => {
    User.find()
            .then(user => res.json(user))
            .catch(err => res.status(400).json({error : err}));
})

userRouter.route('/createuser').post(requireLoggedIn,(req, res) => {
    const {name, phone, email, address} = req.body;

    if( !name || !phone || !email || !address ){
       return res.status(400).json({error : "plz fill all required fields.."});
    }

    const user = User({
        name : name,
        phone: phone,
        email : email,
        address : address
    })

    user.save()
        .then(response => res.json({message : "Successfully Saved"}))
        .catch(err => res.json({error : err}));
})

module.exports =  userRouter;