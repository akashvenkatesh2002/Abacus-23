'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    //await queryInterface.removeColumn('Users', 'id');
    await queryInterface.changeColumn('Users', 'abacusId', {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
    });
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');  
  }
};