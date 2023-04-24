'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Gamindromes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      member1: {
        type: Sequelize.STRING
      },
      riotId1: {
        type: Sequelize.STRING
      },
      discordId1: {
        type: Sequelize.STRING
      },
      member2: {
        type: Sequelize.STRING
      },
      riotId2: {
        type: Sequelize.STRING
      },
      discordId2: {
        type: Sequelize.STRING
      },
      member3: {
        type: Sequelize.STRING
      },
      riotId3: {
        type: Sequelize.STRING
      },
      discordId3: {
        type: Sequelize.STRING
      },
      member4: {
        type: Sequelize.STRING
      },
      riotId4: {
        type: Sequelize.STRING
      },
      discordId4: {
        type: Sequelize.STRING
      },
      member5: {
        type: Sequelize.STRING
      },
      riotId5: {
        type: Sequelize.STRING
      },
      discordId5: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Gamindromes');
  }
};