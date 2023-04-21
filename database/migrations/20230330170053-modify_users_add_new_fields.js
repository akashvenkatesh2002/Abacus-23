module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'Users', // table name
        'timestamp', // new field name
        {
          type: Sequelize.TIME,
          allowNull: true,
        },
      ),
    ]);
  },
};