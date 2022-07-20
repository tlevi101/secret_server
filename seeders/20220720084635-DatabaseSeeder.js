'use strict';

const { faker } = require('@faker-js/faker');
const chalk = require("chalk");
const models = require("../models");
const { User, Track,Playlist} = models;

module.exports = {
  async up (queryInterface, Sequelize) {
    
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
