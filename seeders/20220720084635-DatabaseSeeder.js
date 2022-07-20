"use strict";

const { faker } = require("@faker-js/faker");
const chalk = require("chalk");
const models = require("../models");
const { User, Secret } = models;

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
    } catch (err) {
      console.log(
        chalk.red(
          "A DatabaseSeeder nem futott le teljesen, mivel az alábbi hiba történt:"
        )
      );
      console.log(chalk.gray(e));
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
