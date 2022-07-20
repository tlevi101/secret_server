"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Secrets", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      UserId: {
        type: Sequelize.INTEGER,
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING,
        
      },
      text: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      url: {
        type: Sequelize.STRING,
      },
      ttl:{
        allowNull:true,
        type: Sequelize.DATE,
      },
      viewCounter: {
        type:Sequelize.INTEGER,
      },
      viewLimit: {
        type:Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Secrets");
  },
};
