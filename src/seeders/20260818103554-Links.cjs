"use strict";

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
    await queryInterface.bulkInsert("Links", [
      {
        user_id: 12,
        original_url: "https://www.google.com",
        slug: "aB12x9K",
        created_at: new Date(),
      },
      {
        user_id: 12,
        original_url: "https://github.com",
        slug: "K8mP2q",
        created_at: new Date(),
      },
      {
        user_id: 12,
        original_url: "https://www.youtube.com",
        slug: "xY7n4L",
        created_at: new Date(),
      },
      {
        user_id: 13,
        original_url: "https://www.linkedin.com",
        slug: "Qw9R2t",
        created_at: new Date(),
      },
      {
        user_id: 13,
        original_url: "https://react.dev",
        slug: "mN4kP8",
        created_at: new Date(),
      },
      {
        user_id: 13,
        original_url: "https://laravel.com",
        slug: "Z7xL12a",
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
    await queryInterface.bulkDelete("Links", null, {});
  },
};
