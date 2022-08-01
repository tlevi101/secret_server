"use strict";
const { Model } = require("sequelize");
const Cryptr = require('cryptr');
const cryptr = new Cryptr('SecretServer');
module.exports = (sequelize, DataTypes) => {
  class Secret extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User);
      // define association here
    }
  }
  Secret.init(
    {
      UserId: DataTypes.INTEGER,
      title: {
        type:DataTypes.STRING,
      },
      text: {
        type:DataTypes.STRING,
      },
      ttl:{ 
        type:DataTypes.DATE,
        validate:{
          isDate: true,
        },
      },
      url: {
        type:DataTypes.STRING,
      },
      viewCounter:{ 
        type:DataTypes.INTEGER,
        defaultValue: 0,
      },
      viewLimit: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Secret",
      hooks: {
        beforeCreate:(secret)=>{ 
          secret.title = cryptr.encrypt(secret.title),
          secret.text = cryptr.encrypt(secret.text)
        },
        afterFind:(secret)=>{
          if(secret!==null){
            if(Array.isArray(secret)){
              secret.map((_secret)=>{
                _secret.title = cryptr.decrypt(_secret.title);
                _secret.text = cryptr.decrypt(_secret.text);
              });
            }
            else{
              secret.title = cryptr.decrypt(secret.title);
              secret.text = cryptr.decrypt(secret.text);
            }
          }
        },
      },
    }
  );
  return Secret;
};
