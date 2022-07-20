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
          username: "user"+(i+1),
          email: "user"+(i+1)+"@example.com",
          password: "password",
        });     
        const secretCount = faker.datatype.number({ min:0, max:3 });
        for (let j = 0; j < secretCount; j++){
          const title= faker.lorem.words(faker.datatype.number({min: 2, max:6}));
          const share = faker.datatype.boolean();
          const secret = await Secret.create({ 
            title: title,
            text: faker.lorem.text(),
            UserId:user.id,
            ttl: share ? faker.date.soon(30) : null,
            url: share ? `http://localhost:4000/secrets/${faker.datatype.uuid()}`: null,
            viewLimit: share ? faker.datatype.number({min: 7, max:15}):null,
          });
        }
      }

    } catch (err) {
      console.log(
        chalk.red(
          "DatabaseSeeder could not run properly, because of this error:"
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
