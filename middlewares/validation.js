const Sequelize = require("sequelize");
const  jwt = require('express-jwt');

const sequelizeValidation= async (err, req, res, next) => {
    if(err instanceof jwt.UnauthorizedError) {
        return res.status(401).send({message: err.message});
    }
    if(err instanceof Sequelize.ValidationError) {
        return res.status(400).send({message:err.message});
    }
    if(err instanceof Sequelize.UniqueConstraintError){
        return res.status(409).send({message:err.message});
    }
    next(err, req, res);
}

module.exports = sequelizeValidation;
