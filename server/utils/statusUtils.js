// server/utils/statusUtils.js

const { Tourney, Field, SportsFields, TeamSetup, ScheduleTourney } = require('../models');

/**
 * Met à jour le statut global du tournoi en fonction des statuts des composants.
 * @param {Tourney} tourney - Instance du tournoi.
 */
const updateGlobalStatus = async (tourney) => {
    let newStatus = tourney.status;

    // Vérifier si tous les statuts des composants sont 'completed'
    const allComponentsCompleted = [
        tourney.fieldAssignmentStatus === 'completed',
        tourney.sportAssignmentStatus === 'completed',
        tourney.registrationStatus === 'completed',
        tourney.planningStatus === 'completed'
    ].every(Boolean);

    if (allComponentsCompleted && tourney.status === 'draft') {
        newStatus = 'ready';
    }

    // Mettre à jour le statut global si nécessaire
    if (tourney.status !== newStatus) {
        tourney.status = newStatus;
        await tourney.save();
    }
};

/**
 * Vérifie et met à jour les statuts des composants.
 * @param {number} tourneyId - ID du tournoi.
 */
const checkAndUpdateStatuses = async (tourneyId) => {
    const tourney = await Tourney.findByPk(tourneyId);
    if (!tourney) {
        throw new Error('Tournoi non trouvé');
    }

    // fieldAssignmentStatus: notStarted <-> draft
    const fieldsAssigned = await Field.count({ where: { tourneyId } });
    if (fieldsAssigned > 0 && tourney.fieldAssignmentStatus === 'notStarted') {
        tourney.fieldAssignmentStatus = 'draft';
    } else if (fieldsAssigned === 0 && tourney.fieldAssignmentStatus !== 'notStarted') {
        tourney.fieldAssignmentStatus = 'notStarted';
    }
    await tourney.save();

    // sportAssignmentStatus: notStarted <-> draft
    const sportsAssigned = await SportsFields.count({
        include: [{
            model: Field,
            as: 'field',
            where: { tourneyId }
        }]
    });
    if (sportsAssigned > 0 && tourney.sportAssignmentStatus === 'notStarted') {
        tourney.sportAssignmentStatus = 'draft';
    } else if (sportsAssigned === 0 && tourney.sportAssignmentStatus !== 'notStarted') {
        tourney.sportAssignmentStatus = 'notStarted';
    }
    await tourney.save();

    // registrationStatus: notStarted <-> draft/active
    const teamSetup = await TeamSetup.findOne({ where: { tourneyId } });
    if (teamSetup && tourney.registrationStatus === 'notStarted') {
        tourney.registrationStatus = 'draft';
    } else if (!teamSetup && (tourney.registrationStatus === 'draft' || tourney.registrationStatus === 'active')) {
        tourney.registrationStatus = 'notStarted';
    }
    await tourney.save();

    // planningStatus: notStarted <-> draft/active
    const schedule = await ScheduleTourney.findOne({ where: { tourneyId } });
    if (schedule && tourney.planningStatus === 'notStarted') {
        tourney.planningStatus = 'draft';
    } else if (!schedule && (tourney.planningStatus === 'draft' || tourney.planningStatus === 'active')) {
        tourney.planningStatus = 'notStarted';
    }
    await tourney.save();

    // Mettre à jour le statut global
    await updateGlobalStatus(tourney);
};

/**
 * Récupère le statut d'enregistrement d'un tournoi.
 * @param {number} tourneyId - ID du tournoi.
 * @returns {Promise<string>} - Le statut d'enregistrement du tournoi.
 * @throws {Error} - Si le tournoi n'est pas trouvé.
 */
const getRegistrationStatus = async (tourneyId) => {
    const tourney = await Tourney.findByPk(tourneyId);
    if (!tourney) {
        throw new Error('Tournoi non trouvé');
    }
    return tourney.registrationStatus;
};

module.exports = {
    checkAndUpdateStatuses,
    updateGlobalStatus,
    getRegistrationStatus,
};
