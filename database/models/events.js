'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Events extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Events.init({
    eventId: DataTypes.ARRAY(DataTypes.STRING),
    // isPaid: DataTypes.BOOLEAN,
    abacusId: DataTypes.STRING, 
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Events',
  });
  return Events;
};