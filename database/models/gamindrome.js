'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Gamindrome extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Gamindrome.init({
    member1: DataTypes.STRING,
    riotId1: DataTypes.STRING,
    discordId1: DataTypes.STRING,
    member2: DataTypes.STRING,
    riotId2: DataTypes.STRING,
    discordId2: DataTypes.STRING,
    member3: DataTypes.STRING,
    riotId3: DataTypes.STRING,
    discordId3: DataTypes.STRING,
    member4: DataTypes.STRING,
    riotId4: DataTypes.STRING,
    discordId4: DataTypes.STRING,
    member5: DataTypes.STRING,
    riotId5: DataTypes.STRING,
    discordId5: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Gamindrome',
  });
  return Gamindrome;
};