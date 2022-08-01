const express = require('express');
const jsonwebtoken = require('jsonwebtoken');
const models = require("../models");
const {User} = models;
const xml2js = require('xml2js');
const router = express.Router();
const finalResponse = (data, req,res) =>{

    if (req.accepts('application/xml')){
        const builder = new xml2js.Builder();
        let _data = data;
        if(Array.isArray(data)){
            _data = (_data.map((x)=>{
                const y={secret:x.dataValues};
                return y;
            }))
        }
        const xml = builder.buildObject(_data);
        res.setHeader('Content-Type', 'application/xml');
        return res.status(200).send(xml);
    }
    else if (req.accepts('application/json')){
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).send(data);
    }
}
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
        return finalResponse({token},req,res);
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
    return finalResponse({token},req,res);
  

});

module.exports = router;