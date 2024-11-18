 // server/controllers/tourneyController.js
const { Tourney, Field, SportsFields, Sport, ScheduleTourney, Team, Pool, PoolSchedule, Game } = require('../models');

const PlanningStrategyManager = require('../services/planningStrategies/pool/planningStrategyManager');


exports.getPlanningDetails = async (req, res) => {
    try {
      const { tourneyId } = req.params;
  
      // Récupérer les informations des terrains
      const fields = await Field.findAll({
        where: { tourneyId },
        include: {
          model: SportsFields,
          as: 'sportsFields',
          include: { model: Sport, as: 'sport', attributes: ['id', 'name', 'color'] },
        },
      });

        // Extraire une liste unique des sports depuis les terrains
        const sports = [];
        fields.forEach(field => {
        field.sportsFields.forEach(sportsField => {
            if (!sports.find(sport => sport.id === sportsField.sport.id)) {
            sports.push(sportsField.sport); // Ajouter uniquement les sports uniques
            }
        });
        });
  
        // Récupérer les pools avec leurs équipes et leurs schedules
        const pools = await Pool.findAll({
            where: { tourneyId },
            include: [
            {
                model: Team,
                as: 'teams',
                attributes: ['id', 'teamName'],
            },
            {
                model: PoolSchedule,
                as: 'schedules',
                include: {
                model: Field,
                as: 'field',
                attributes: ['id', 'name', 'description'],
                },
                attributes: ['id', 'fieldId', 'startTime', 'endTime', 'date'],
            },
            ],
        });
  
      // Récupérer les matchs planifiés
      const games = await Game.findAll({
        where: { tourneyId },
        include: [
          { model: Team, as: 'teamA', attributes: ['id', 'teamName'] },
          { model: Team, as: 'teamB', attributes: ['id', 'teamName'] },
        ],
        attributes: ['id', 'fieldId', 'poolId', 'startTime', 'endTime'],
      });
  
      // Récupérer la configuration du planning
      const scheduleTourney = await ScheduleTourney.findOne({
        where: { tourneyId },
      });
  
      // Construire la réponse
      res.status(200).json({
        fields,
        pools,
        games,
        scheduleTourney,
        sports,
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du planning complet :', error);
      res.status(500).json({ message: 'Erreur serveur.', error });
    }
};
  
exports.generatePoolPlanning = async (req, res) => {
  const tourneyId = req.params.tourneyId;
  const { strategy } = req.body;

  try {
    // Vérifier si le tournoi existe
    const tourney = await Tourney.findByPk(tourneyId);
    if (!tourney) {
      return res.status(404).json({ message: 'Tournoi non trouvé.' });
    }

    const planningStrategyManager = new PlanningStrategyManager(tourneyId, strategy);
    await planningStrategyManager.generatePlanning();

    res.status(200).json({ message: 'Planning généré avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la génération du planning :', error);
    res.status(500).json({ message: error.message });
  }
};