// models/poolSchedule.js
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PoolSchedule extends Model {
    static associate(models) {
      PoolSchedule.belongsTo(models.Pool, { foreignKey: 'poolId', as: 'pool' });
      PoolSchedule.belongsTo(models.Field, {
        foreignKey: 'fieldId',
        as: 'field',
      });
      PoolSchedule.belongsTo(models.Sport, {
        foreignKey: 'sportId',
        as: 'sport',
      });
    }
  }

  PoolSchedule.init(
    {
      poolId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fieldId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      sportId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      startTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      endTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'PoolSchedule',
    }
  );

  return PoolSchedule;
};
