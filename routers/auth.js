const express = require('express');
const jsonwebtoken = require('jsonwebtoken');
const models = require("../models");
const {User} = models;

const router = express.Router();

router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    if(!email||!password) {
        return res.status(400).send({message: "Email and password are required!"});
    }
    const user=await User.findOne({where: {email}});
    if(!user) {
        return res.status(404).send({message: "Eamil does not exist"});
    }
    if(user.comparePassword(password)){
        const token=jsonwebtoken.sign(user.toJSON(), "SecretServer",{algorithm:'HS256'});
        return res.send({token});
    }
    return res.status(401).send({message:"Wrong password"});
});

router.post('/register', async (req, res) => {
    const {email, password, username,passwordAgain} = req.body;
    if(!email || !password || !username ||!passwordAgain) {
        return res.status(400).send({message: "Email, password, passwordAgain and username are required!"});
    }
    if(password!==passwordAgain) {
        return res.status(400).send({message: "Password and passwordAgain does not match!"});
    }
    const user = await User.create({username,email,password});
    //login
    const token = jsonwebtoken.sign(user.toJSON(),"SecretServer",{algorithm:'HS256'});
    return res.status(201).send({token});

});

module.exports = router;