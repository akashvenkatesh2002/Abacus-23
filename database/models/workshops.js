'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Workshops extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Workshops.init({
    workshopId: DataTypes.ARRAY(DataTypes.STRING),
    abacusId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Workshops',
  });
  return Workshops;
};