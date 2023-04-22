'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      mobile: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      accessTokens: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      otp: {
        type: Sequelize.STRING
      },
      otpTimestamp: {
        type: Sequelize.DATE
      },
      year: {
        type: Sequelize.INTEGER
      },
      collegeName: {
        type: Sequelize.STRING
      },
      accomodation: {
        type: Sequelize.STRING
      },
      abacusId: {
        type: Sequelize.STRING
      },
      collegeEmail: {
        type: Sequelize.STRING
      },
      isPassBought: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('Users');
  }
};