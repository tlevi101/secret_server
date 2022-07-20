'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Secret extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User)
      // define association here
    }
  }
  Secret.init({
    user_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    text: DataTypes.STRING,
    ttl: DataTypes.DATE,
    url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Secret',
  });
  return Secret;
};