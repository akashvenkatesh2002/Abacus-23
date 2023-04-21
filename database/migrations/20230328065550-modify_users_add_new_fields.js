module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'Users', // table name
        'accessTokens', // new field name
        {
          type: Sequelize.ARRAY(Sequelize.STRING),
          allowNull: true,
        },
      )
    ]);
  },
};