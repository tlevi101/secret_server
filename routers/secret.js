require("dotenv").config();
const express = require('express');
const jsonwebtoken = require('jsonwebtoken');
const models = require("../models");
const auth= require('../middlewares/auth');
const {User, Secret} = models;
const { v4: uuidv4 } = require('uuid');
const { Op } = require("sequelize");
const xml2js = require('xml2js');


const router = express.Router();
const finalResponse = (secret, req,res) =>{

    if (req.accepts('application/xml')){
        const builder = new xml2js.Builder();
        let _secret = secret;
        if(Array.isArray(secret)){
            _secret = (secret.map((x)=>{
                const secret={secret:x.dataValues};
                return secret;
            }))
        }
        const xml = builder.buildObject(_secret);
        res.setHeader('Content-Type', 'application/xml');
        res.status(200).send(xml);
    }
    else if (req.accepts('json')){
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(secret);
    }
}
const unExpired= (secret) => {
    const now =Date.now();
    if(secret.ttl!==null){
        return secret.viewCounter!==secret.viewLimit && secret.ttl>=now;
    }
    return secret.viewCounter!==secret.viewLimit;
}

router.get('/my-secrets', auth,async (req, res) => {
  
    if(!req.user){
        return res.sendStatus(401);
    }
    const mySecrets= await Secret.findAll({where: {UserId: req.user.id}});
    finalResponse(mySecrets,req,res);
});
router.post('/my-secrets/add', auth,async (req, res) => {
    const {title, text} = req.body;
    if(!req.user){
        return res.sendStatus(401);
    }
    if(!title || !text){
        return res.status(400).send({message:"Title and text are required!"});
    }
    const newSecret= await Secret.create({UserId:req.user.id,title: title, text: text});
    finalResponse(newSecret,req,res);
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
    if(secret.UserId!==req.user.id){
        return res.sendStatus(403);
    }
    if(!viewLimit || viewLimit===0){
        return res.status(400).send({message:"Viewlimit is required, and must be greater than zero!"});
    }
    const uuid = uuidv4();
    const url = uuid;
    const sharedSecret=await secret.update({viewLimit: viewLimit, ttl: ttl, url: url});
    finalResponse({url:sharedSecret.url},req,res);
    
});

router.get('/secrets/:uuid',async (req, res)=>{
    const {uuid}=req.params;
    if(!uuid){
        return res.sendStatus(400);
    }
    const secret = await Secret.findOne({where:{url:{[Op.like]:`%${uuid}`}}});
    if(!secret){
        return res.sendStatus(404);
    }
    if(!unExpired(secret)){
        return res.status(410).send({message: "This secret has expired!"});
    }
    let viewCounter = secret.viewCounter;
    await secret.update({viewCounter: ++viewCounter});
    finalResponse({ title:secret.title, text:secret.text },req,res);
});

module.exports = router;