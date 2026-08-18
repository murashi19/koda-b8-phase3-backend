"use strict";
const bcrypt = require("bcrypt");
const { DATE } = require("sequelize");
const { now } = require("sequelize/lib/utils");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const hashedPassword = await bcrypt.hash("test123", 10);

    await queryInterface.bulkInsert("Users", [
      {
        email: "test@example.com",
        password: hashedPassword,
        created_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete(
      "Users",
      {
        email: "test@example.com",
      },
      {},
    );
  },
};
