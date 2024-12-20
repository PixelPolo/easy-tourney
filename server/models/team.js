// models/team.js
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Team extends Model {
    static associate(models) {
      // Une équipe appartient à un tournoi
      Team.belongsTo(models.Tourney, {
        foreignKey: 'tourneyId',
        as: 'tourney',
      });
      // Une équipe peut avoir plusieurs UsersTourneys
      Team.hasMany(models.UsersTourneys, {
        foreignKey: 'teamId',
        as: 'usersTourneys',
      });
      // Une équipe peut appartenir à une Pool
      Team.belongsTo(models.Pool, { foreignKey: 'poolId', as: 'pool' });

      // Une équipe peut avoir plusieurs joueurs
      Team.belongsToMany(models.User, {
        through: models.UsersTourneys,
        foreignKey: 'teamId',
        otherKey: 'userId',
        as: 'players',
      });
    }
  }

  Team.init(
    {
      teamName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM('player', 'assistant'),
        allowNull: false,
        defaultValue: 'player',
      },
      poolId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Pools',
          key: 'id',
        },
        onDelete: 'SET NULL', // Si on supprime Team, rendre NULL l'association
        onUpdate: 'CASCADE',
      },
    },
    {
      sequelize,
      modelName: 'Team',
    }
  );

  return Team;
};
