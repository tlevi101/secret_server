require("dotenv").config();
const express = require('express');
const jsonwebtoken = require('jsonwebtoken');
const models = require("../models");
const auth= require('../middlewares/auth');
const {User, Secret} = models;
const { v4: uuidv4 } = require('uuid');
const { Op } = require("sequelize");

const router = express.Router();

const unExpired= (secret) => {
    const now =Date.now();
    if(secret.ttl!==null){
        const diffTime=Math.abs(secret.ttl-now);
        const diffDays = Math.ceil(diffTime/(1000*60*60*24));
        return secret.viewCounter!==secret.viewLimit &&  diffDays!==1;
    }
    return secret.viewCounter!==secret.viewLimit;
}

router.get('/my-secrets', auth,async (req, res) => {
    if(!req.user){
        return res.sendStatus(401);
    }
    const mySecrets= await Secret.findAll({where: {UserId: req.user.id}});
    res.status(200).send(mySecrets);
});
router.post('/my-secrets/add', auth,async (req, res) => {
    const {title, text} = req.body;
    if(!req.user){
        return res.sendStatus(401);
    }
    const newSecret= await Secret.create({title: title, text: text});
    res.status(200).send(newSecret);
});
router.put('/my-secrets/share/:id', auth,async (req, res) => {
    const {id}=req.params;
    if(isNaN(parseInt(id))){
        return res.sendStatus(400);
    }
    const {viewLimit, ttl} = req.body;
    if(!req.user){
        return res.sendStatus(401);
    }
    const secret = await Secret.findByPk(id);
    if(!secret){
        return res.sendStatus(404);
    }
    if(!viewLimit || viewLimit===0){
        return res.status(400).send({message:"Viewlimit is required, and must be greater than zero!"});
    }
    const uuid = uuidv4();
    const url = `http://${req.headers.host}/secrets/${uuid}`;
    const sharedSecret=await secret.update({viewLimit: viewLimit, ttl: ttl, url: url});
    res.status(200).send(sharedSecret.url);
});

router.get('/secrets/:uuid',async (req, res)=>{
    const {uuid}=req.params;
    if(!uuid){
        return res.sendStatus(400);
    }
    const secret = await Secret.findOne({where:{url:{[Op.gt]:`*/${uuid}$`}}});
    if(!secret){
        return res.sendStatus(404);
    }
    if(!unExpired(secret)){
        return res.status(410).send({message: "This secret has expired!"});
    }
    let viewCounter = secret.viewCounter;
    await secret.update({viewCounter: ++viewCounter});
    res.status(200).send({ title:secret.title, text:secret.text });
});

module.exports = router;