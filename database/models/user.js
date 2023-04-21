'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    mobile: DataTypes.STRING,
    password: DataTypes.STRING,
    accessTokens: DataTypes.ARRAY(DataTypes.STRING),
    otp: DataTypes.STRING,
    otpTimestamp: DataTypes.DATE,
    year: DataTypes.INTEGER,
    collegeName: DataTypes.STRING,
    department: DataTypes.STRING,
    accomodation: DataTypes.STRING,
    abacusId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};