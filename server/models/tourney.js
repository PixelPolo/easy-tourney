const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Tourney extends Model {
        static associate(models) {
            // Un tournoi a un planning et une configuration de groupes
            Tourney.hasOne(models.ScheduleTourney, { foreignKey: 'tourneyId', as: 'schedule' });
            Tourney.hasOne(models.GroupSetup, { foreignKey: 'tourneyId', as: 'groupSetup' });
        }
    }

    Tourney.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        dateTourney: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        domain: {
            type: DataTypes.STRING,
            allowNull: true, // Optionnel
        },
        numberOfField: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        emergencyDetails: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('draft', 'ready', 'active', 'completed'),
            allowNull: false,
            defaultValue: 'draft', // Par défaut, le tournoi est en état "draft"
        },
    }, {
        sequelize,
        modelName: 'Tourney',
    });

    return Tourney;
};