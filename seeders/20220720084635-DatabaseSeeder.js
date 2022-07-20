"use strict";

// Faker documentation, API reference: https://fakerjs.dev/guide/#node-js
const { faker } = require("@faker-js/faker");
const bcrypt = require('bcrypt');
const chalk = require("chalk");
const models = require("../models");
const { User, Secret } = models;

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      const userCount = faker.datatype.number({ min: 10, max: 20 });
      for (let i = 0; i < userCount; i++) {
        const user = await User.create({
          username: faker.internet.userName(),
          email:faker.internet.email(),
          password: bcrypt.hashSync("password", bcrypt.genSaltSync(10)),
        });     
        const secretCount = faker.datatype.number({ min:0, max:3 });
        for (let j = 0; j < secretCount; j++){
          const generateTTL = faker.datatype.boolean();
          const secret = await Secret.create({ 
            title: faker.lorem.words(faker.datatype.number({min: 2, max:6})),
            text: faker.lorem.text(),
            user_id:user.id,
            ttl: generateTTL ? faker.date.soon(30) : null,
            url: faker.datatype.uuid(),
          });
        }
      }

    } catch (err) {
      console.log(
        chalk.red(
          "A DatabaseSeeder could not run properly, because of this error:"
        )
      );
      console.log(chalk.gray(err));
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
