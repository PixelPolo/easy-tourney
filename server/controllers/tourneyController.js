// server/controllers/tourneyController.js

const { Op } = require('sequelize');
const {
  Tourney,
  Field,
  SportsFields,
  Sport,
  TeamSetup,
  User,
  Team,
  UsersTourneys,
  ScheduleTourney,
  Role,
  InviteToken,
  Pool,
  PoolSchedule,
  Game,
} = require('../models');
const { checkAndUpdateStatuses } = require('../utils/statusUtils');
const jwt = require('jsonwebtoken');

/**
 * Créer un nouveau tournoi
 */
exports.createTourney = async (req, res) => {
  try {
    const {
      name,
      location,
      dateTourney,
      emergencyDetails,
      domain,
      tourneyType,
      maxNumberOfPools,
      defaultMaxTeamPerPool,
      defaultMinTeamPerPool,
      status,
      latitude,
      longitude,
    } = req.body;

    if (!name || !location || !dateTourney) {
      return res
        .status(400)
        .json({
          message:
            'Les champs \'name\', \'location\' et \'dateTourney\' sont requis.',
        });
    }

    // Créer le tournoi principal
    const newTourney = await Tourney.create({
      name,
      location,
      dateTourney,
      emergencyDetails,
      domain,
      tourneyType,
      maxNumberOfPools,
      defaultMaxTeamPerPool,
      defaultMinTeamPerPool,
      status,
      latitude,
      longitude
    });

    // Créer une configuration de planning par défaut
    await ScheduleTourney.create({
      tourneyId: newTourney.id,
      startTime: '07:30:00',
      endTime: '17:30:00',
      poolDuration: 105,
      gameDuration: 15,
      transitionPoolTime: 15,
      transitionGameTime: 5,
      // Ajoutez d'autres champs par défaut si nécessaire
    });

    res.status(201).json(newTourney);
  } catch (error) {
    console.error('Erreur lors de la création du tournoi :', error);
    res
      .status(500)
      .json({ message: 'Erreur lors de la création du tournoi', error });
  }
};

/**
 * Récupérer tous les tournois
 */
exports.getTourneys = async (req, res) => {
  try {
    const tourneys = await Tourney.findAll();
    res.status(200).json(tourneys);
  } catch (error) {
    console.error('Erreur lors de la récupération des tournois :', error);
    res
      .status(500)
      .json({ message: 'Erreur lors de la récupération des tournois', error });
  }
};

/**
 * Récupérer un tournoi par son ID avec les détails des équipes et des utilisateurs
 */
exports.getAllDataTourneyById = async (req, res) => {
  try {
    const { tourneyId } = req.params;

    const tourney = await Tourney.findByPk(tourneyId, {
      include: [
        {
          model: Team,
          as: 'teams',
          include: [
            {
              model: UsersTourneys,
              as: 'usersTourneys',
              include: [
                {
                  model: User,
                  as: 'user',
                  attributes: ['id', 'name', 'email', 'phone'],
                  include: [
                    {
                      model: Role,
                      as: 'role',
                      attributes: ['id', 'name'],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          model: UsersTourneys,
          as: 'usersTourneys',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email', 'phone'],
              include: [
                {
                  model: Role,
                  as: 'role',
                  attributes: ['id', 'name'],
                },
              ],
            },
            {
              model: Team,
              as: 'team',
              attributes: ['id', 'teamName', 'type'],
            },
          ],
        },
      ],
    });

    if (!tourney) {
      return res.status(404).json({ message: 'Tournoi non trouvé' });
    }

    res.status(200).json(tourney);
  } catch (error) {
    console.error('Erreur lors de la récupération du tournoi :', error);
    res
      .status(500)
      .json({ message: 'Erreur lors de la récupération du tournoi', error });
  }
};

/**
 * Récupérer un tournoi par son ID avec les détails nécessaires
 */
exports.getTourneyById = async (req, res) => {
  try {
    const { tourneyId } = req.params;

    const tourney = await Tourney.findByPk(tourneyId, {
      attributes: [
        'id',
        'name',
        'location',
        'dateTourney',
        'emergencyDetails',
        'domain',
        'tourneyType',
        'maxNumberOfPools',
        'defaultMaxTeamPerPool',
        'defaultMinTeamPerPool',
        'status',
        'fieldAssignmentStatus',
        'sportAssignmentStatus',
        'registrationStatus',
        'poolStatus',
        'planningStatus',
      ],
      // Pas d'inclusion d'associations inutiles
    });

    if (!tourney) {
      return res.status(404).json({ message: 'Tournoi non trouvé' });
    }

    res.status(200).json(tourney);
  } catch (error) {
    console.error('Erreur lors de la récupération du tournoi :', error);
    res
      .status(500)
      .json({ message: 'Erreur lors de la récupération du tournoi', error });
  }
};

/**
 * Mettre à jour un tournoi existant
 */
exports.updateTourney = async (req, res) => {
  try {
    const { tourneyId } = req.params;
    const { status, ...otherUpdates } = req.body;

    const tourney = await Tourney.findByPk(tourneyId);

    if (!tourney) {
      return res.status(404).json({ message: 'Tournoi non trouvé.' });
    }

    // Récupérer l'ancienne date du tournoi avant la mise à jour
    const oldDate = new Date(tourney.dateTourney); // ancienne date
    await tourney.update(otherUpdates);
    const newDate = new Date(tourney.dateTourney); // nouvelle date après update

    // Calculer le décalage en millisecondes entre l'ancienne et la nouvelle date
    const timeDiff = newDate.getTime() - oldDate.getTime();

    // Si il y a un changement de date, on met à jour les entités liées
    if (timeDiff !== 0) {
      // Mettre à jour les PoolSchedules
      // Pour trouver tous les PoolSchedules liés à ce tournoi, on passe par les pools
      // car PoolSchedule a un poolId, et Pool est lié au Tourney
      const pools = await Pool.findAll({ where: { tourneyId: tourney.id } });
      const poolIds = pools.map(p => p.id);

      const poolSchedules = await PoolSchedule.findAll({
        where: { poolId: { [Op.in]: poolIds } }
      });

      for (const ps of poolSchedules) {
        // ps.date est en DATEONLY (YYYY-MM-DD)
        const psDate = new Date(ps.date);
        const newPsDate = new Date(psDate.getTime() + timeDiff);

        const yyyy = newPsDate.getFullYear();
        const mm = String(newPsDate.getMonth() + 1).padStart(2, '0');
        const dd = String(newPsDate.getDate()).padStart(2, '0');
        const formattedDate = `${yyyy}-${mm}-${dd}`;

        await ps.update({ date: formattedDate });
      }

      // Mettre à jour les Games
      // Les Game sont liés au tournoi via tourneyId
      const games = await Game.findAll({ where: { tourneyId: tourney.id } });
      for (const game of games) {
        const updates = {};

        // startTime et endTime sont des DATE complètes
        if (game.startTime) {
          updates.startTime = new Date(game.startTime.getTime() + timeDiff);
        }
        if (game.endTime) {
          updates.endTime = new Date(game.endTime.getTime() + timeDiff);
        }

        // realStartTime et realEndTime sont optionnels
        if (game.realStartTime) {
          updates.realStartTime = new Date(game.realStartTime.getTime() + timeDiff);
        }
        if (game.realEndTime) {
          updates.realEndTime = new Date(game.realEndTime.getTime() + timeDiff);
        }

        // pausedAt est optionnel
        if (game.pausedAt) {
          updates.pausedAt = new Date(game.pausedAt.getTime() + timeDiff);
        }

        await game.update(updates);
      }
    }

    let statusForced = false;
    let statusMessage = '';

    // Gérer le statut si besoin
    if (status) {
      if (tourney.status === 'draft' && status === 'ready') {
        const canMoveToReady =
          tourney.fieldAssignmentStatus === 'completed' &&
          tourney.sportAssignmentStatus === 'completed' &&
          tourney.registrationStatus === 'completed' &&
          tourney.poolStatus === 'completed' &&
          tourney.planningStatus === 'completed';

        if (canMoveToReady) {
          tourney.status = 'ready';
          statusMessage =
            'Le statut du tournoi a été mis à jour automatiquement en "ready".';
        } else {
          tourney.status = 'ready';
          statusForced = true;
          statusMessage =
            'Le statut du tournoi a été forcé en "ready" malgré des statuts incomplets.';
        }
        await tourney.save();
      } else {
        tourney.status = status;
        await tourney.save();
        statusMessage = `Le statut du tournoi a été mis à jour en "${status}".`;
      }
    }

    // Mettre à jour les statuts après la mise à jour du tournoi
    await checkAndUpdateStatuses(tourney.id);

    res.status(200).json({
      tourney,
      statusForced,
      statusMessage,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du tournoi :', error);
    res
      .status(500)
      .json({ message: 'Erreur lors de la mise à jour du tournoi', error });
  }
};

/**
 * Supprimer un tournoi et réinitialiser les associations utilisateurs-équipes
 */
exports.deleteTourney = async (req, res) => {
  try {
    const { tourneyId } = req.params;

    // Démarrer une transaction pour assurer l'atomicité
    const transaction = await Tourney.sequelize.transaction();

    try {
      const tourney = await Tourney.findOne({
        where: { id: tourneyId },
        include: [
          {
            model: Team,
            as: 'teams',
            include: [
              {
                model: UsersTourneys,
                as: 'usersTourneys',
                include: [
                  {
                    model: User,
                    as: 'user',
                  },
                ],
              },
            ],
          },
          {
            model: UsersTourneys,
            as: 'usersTourneys',
            include: [
              {
                model: User,
                as: 'user',
              },
              {
                model: Team,
                as: 'team',
              },
            ],
          },
        ],
        transaction,
      });

      if (!tourney) {
        await transaction.rollback();
        return res.status(404).json({ message: 'Tournoi non trouvé.' });
      }

      // Réinitialiser les utilisateurs assignés aux équipes
      if (tourney.teams.length > 0) {
        for (const team of tourney.teams) {
          for (const userTourney of team.usersTourneys) {
            userTourney.teamId = null;
            userTourney.tourneyRole = 'guest';
            await userTourney.save({ transaction });
          }
        }
      }

      // Supprimer toutes les associations UsersTourneys non liées aux équipes
      await UsersTourneys.destroy({
        where: { tourneyId, teamId: null },
        transaction,
      });

      // Supprimer les équipes
      await Team.destroy({
        where: { tourneyId },
        transaction,
      });

      // Supprimer le tournoi
      await tourney.destroy({ transaction });

      // Commit de la transaction
      await transaction.commit();

      res.status(204).send();
    } catch (error) {
      // Rollback de la transaction en cas d'erreur
      await transaction.rollback();
      console.error('Erreur lors de la suppression du tournoi :', error);
      res
        .status(500)
        .json({ message: 'Erreur lors de la suppression du tournoi', error });
    }
  } catch (error) {
    console.error('Erreur lors de la suppression du tournoi :', error);
    res
      .status(500)
      .json({ message: 'Erreur lors de la suppression du tournoi', error });
  }
};

/**
 * Récupérer les sports associés à un terrain
 */
exports.getSportsByField = async (req, res) => {
  try {
    const { fieldId } = req.params;

    const sportsFields = await SportsFields.findAll({
      where: { fieldId },
      include: [
        {
          model: Sport,
          as: 'sport',
          attributes: ['id', 'name', 'rule', 'scoreSystem', 'color', 'image'],
        },
      ],
    });

    if (sportsFields.length === 0) {
      return res
        .status(404)
        .json({ message: 'Aucun sport n\'est associé à ce terrain.' });
    }

    res.status(200).json(sportsFields);
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des sports par terrain :',
      error
    );
    res
      .status(500)
      .json({ message: 'Erreur lors de la récupération des sports', error });
  }
};

/**
 * Récupérer les détails d'un tournoi, y compris les équipes et les utilisateurs associés
 */
exports.getTourneyTeamsDetails = async (req, res) => {
  const tourneyId = req.params.tourneyId;

  try {
    // Vérifier si le tournoi existe
    const tourney = await Tourney.findByPk(tourneyId);
    if (!tourney) {
      return res.status(404).json({ message: 'Tournoi non trouvé' });
    }

    // Récupérer la configuration des équipes avec TeamSetup
    const teamSetup = await TeamSetup.findOne({
      where: { tourneyId },
      attributes: ['maxTeamNumber', 'playerPerTeam', 'minPlayerPerTeam'],
    });

    // Récupérer toutes les équipes avec leurs utilisateurs via UsersTourneys, en excluant les admins
    const teams = await Team.findAll({
      where: { tourneyId },
      attributes: ['id', 'teamName', 'type'],
      include: [
        {
          model: UsersTourneys,
          as: 'usersTourneys',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email', 'phone'],
              where: {
                roleId: { [Op.ne]: 1 }, // Exclure les admins
              },
              include: [
                {
                  model: Role,
                  as: 'role',
                  attributes: ['id', 'name'],
                },
              ],
            },
          ],
        },
      ],
    });

    // Récupérer les utilisateurs non assignés à une équipe, en excluant les admins
    const unassignedUsers = await UsersTourneys.findAll({
      where: {
        tourneyId,
        teamId: null,
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone'],
          where: {
            roleId: { [Op.ne]: 1 }, // Exclure les admins
          },
          include: [
            {
              model: Role,
              as: 'role',
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
    });

    // Récupérer tous les utilisateurs inscrits au tournoi, en excluant les admins
    const allUsers = await UsersTourneys.findAll({
      where: { tourneyId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone'],
          where: {
            roleId: { [Op.ne]: 1 }, // Exclure les admins
          },
          include: [
            {
              model: Role,
              as: 'role',
              attributes: ['id', 'name'],
            },
          ],
        },
        {
          model: Team,
          as: 'team',
          attributes: ['id', 'teamName', 'type'],
        },
      ],
    });

    // Mettre à jour les statuts après la récupération des détails du tournoi
    await checkAndUpdateStatuses(tourneyId);

    res.json({
      teamSetup,
      teams,
      unassignedUsers,
      allUsers,
    });
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des détails du tournoi:',
      error
    );
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

/**
 * Récupérer les statuts d'un tournoi
 */
exports.getTourneyStatuses = async (req, res) => {
  try {
    const { tourneyId } = req.params;
    const tourney = await Tourney.findByPk(tourneyId);
    if (!tourney) {
      return res.status(404).json({ message: 'Tournoi non trouvé' });
    }

    const {
      name,
      tourneyType,
      dateTourney,
      status,
      fieldAssignmentStatus,
      sportAssignmentStatus,
      registrationStatus,
      poolStatus,
      planningStatus,
    } = tourney;
    res.status(200).json({
      name,
      tourneyType,
      dateTourney,
      status,
      fieldAssignmentStatus,
      sportAssignmentStatus,
      registrationStatus,
      poolStatus,
      planningStatus,
    });
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des statuts du tournoi:',
      error
    );
    res
      .status(500)
      .json({ message: 'Erreur lors de la récupération des statuts', error });
  }
};

/**
 * Récupérer les statuts d'enregistrememnt du tournoi
 */
exports.getRegistrationStatus = async (req, res) => {
  try {
    const { tourneyId } = req.params;
    const tourney = await Tourney.findByPk(tourneyId);
    if (!tourney) {
      return res.status(404).json({ message: 'Tournoi non trouvé' });
    }

    const { name, registrationStatus } = tourney;
    res.status(200).json({
      name: name,
      registrationStatus,
    });
  } catch (error) {
    console.error(
      'Erreur lors de la récupération du statut inscription:',
      error
    );
    res
      .status(500)
      .json({
        message: 'Erreur lors de la récupération du statut inscription',
        error,
      });
  }
};

/*
 * Rejointe un tournoi via un token d'invitation
 */
exports.joinTourneyWithToken = async (req, res) => {
  const { token } = req.body;

  try {
    // Vérifie et décode le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { tourneyId, type } = decoded;

    // Vérifie si le token est bien un token d'invitation
    if (type !== 'invite') {
      return res
        .status(400)
        .json({ message: 'Le token n\'est pas valide pour une invitation.' });
    }

    // Vérifie si le token est valide et non expiré dans la base de données
    const inviteToken = await InviteToken.findOne({
      where: { token, tourneyId, isValid: true },
    });

    if (!inviteToken) {
      return res.status(400).json({ message: 'Token invalide ou expiré.' });
    }

    // Vérifie que le token n'est pas expiré
    if (new Date() > inviteToken.expiresAt) {
      return res.status(400).json({ message: 'Le token a expiré.' });
    }

    // Vérifie l'état des inscriptions du tournoi
    const tourney = await Tourney.findByPk(tourneyId);
    // Vérifier que le tournoi existe
    if (!tourney) {
      return res.status(404).json({ message: 'Tournoi non trouvé.' });
    }
    if (tourney.registrationStatus !== 'active') {
      return res
        .status(400)
        .json({
          message: 'Les inscriptions pour ce tournoi ne sont pas ouvertes.',
        });
    }

    // Utiliser l'userId actuel de la session pour inscrire l'utilisateur au tournoi
    const userId = req.user.id;

    // Vérifie si l'utilisateur est déjà inscrit au tournoi
    const existingUserTourney = await UsersTourneys.findOne({
      where: { userId, tourneyId },
    });

    if (existingUserTourney) {
      return res
        .status(400)
        .json({ message: 'Vous êtes déjà inscrit à ce tournoi.' });
    }

    // Crée une nouvelle inscription au tournoi avec le rôle de "Guest"
    const userTourney = await UsersTourneys.create({
      userId,
      tourneyId,
      teamId: null,
      tourneyRole: 'guest',
    });

    res
      .status(201)
      .json({ message: 'Inscription réussie au tournoi.', userTourney });
  } catch (error) {
    console.error(
      'Erreur lors de la vérification du token d\'invitation:',
      error
    );
    res.status(400).json({ message: 'Token invalide ou expiré.' });
  }
};

/**
 * Récupérer les détails des pools d'un tournoi, y compris les pools, les équipes, et la configuration des équipes
 */
exports.getTourneyPoolsDetails = async (req, res) => {
  const tourneyId = req.params.tourneyId;

  try {
    // Vérifier si le tournoi existe et récupérer les valeurs par défaut
    const tourney = await Tourney.findByPk(tourneyId, {
      attributes: [
        'id',
        'name',
        'tourneyType',
        'domain',
        'dateTourney',
        'maxNumberOfPools',
        'defaultMaxTeamPerPool',
        'defaultMinTeamPerPool',
        'status',
        'fieldAssignmentStatus',
        'sportAssignmentStatus',
        'registrationStatus',
        'poolStatus',
        'planningStatus',
      ],
    });
    if (!tourney) {
      return res.status(404).json({ message: 'Tournoi non trouvé' });
    }

    // Récupérer les pools avec les équipes associées
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
          attributes: ['id'],
        },
      ],
    });

    // Récupérer les équipes du tournoi (type 'player')
    const teams = await Team.findAll({
      where: {
        tourneyId,
        type: 'player',
      },
      attributes: ['id', 'teamName', 'type', 'poolId'],
      include: [
        {
          model: UsersTourneys,
          as: 'usersTourneys',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email'],
              where: {
                roleId: { [Op.ne]: 1 }, // Exclure les admins
              },
              include: [
                {
                  model: Role,
                  as: 'role',
                  attributes: ['id', 'name'],
                },
              ],
            },
          ],
        },
      ],
    });

    res.json({
      pools,
      teams,
      tourneySetup: {
        maxNumberOfPools: tourney.maxNumberOfPools,
        defaultMaxTeamPerPool: tourney.defaultMaxTeamPerPool,
        defaultMinTeamPerPool: tourney.defaultMinTeamPerPool,
      },
    });
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des détails des pools du tournoi:',
      error
    );
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};


/**
 * Récupère les détails complets d'un tournoi, y compris les statistiques nécessaires pour la page Détails.
 * @param {Object} req - Requête HTTP.
 * @param {Object} res - Réponse HTTP.
 */
exports.getTourneyDetails = async (req, res) => {
  try {
    const { tourneyId } = req.params;

    // 1. Vérifier si le tournoi existe
    const tourney = await Tourney.findByPk(tourneyId);

    if (!tourney) {
      return res.status(404).json({ message: 'Tournoi non trouvé.' });
    }

    // 2. Récupérer les statistiques en parallèle
    const [
      usersCount,
      fieldsCount,
      sportsList,
      teamsCount,
      timeSlotsCount,
      poolsCount,
    ] = await Promise.all([
      // a. Nombre d'utilisateurs inscrits (excluant les admins)
      UsersTourneys.count({
        where: { tourneyId },
        include: [
          {
            model: User,
            as: 'user',
            where: { roleId: { [Op.ne]: 1 } }, // Exclure les administrateurs (roleId = 1)
            attributes: [],
          },
        ],
        distinct: true,
        col: 'userId',
      }),
      // b. Nombre de terrains
      Field.count({
        where: { tourneyId },
      }),
      // c. Liste unique des sports via SportsFields et Fields
      Sport.findAll({
        include: [
          {
            model: SportsFields,
            as: 'sportsFields',
            required: true,
            include: [
              {
                model: Field,
                as: 'field',
                where: { tourneyId },
                attributes: [],
              },
            ],
            attributes: [],
          },
        ],
        attributes: ['id', 'name', 'color'],
        group: ['Sport.id'],
        raw: true,
      }),
      // d. Nombre d'équipes
      Team.count({
        where: { tourneyId },
      }),
      // e. Nombre total de créneaux horaires par pool via PoolSchedules et Pools
      PoolSchedule.count({
        include: [
          {
            model: Pool,
            as: 'pool',
            where: { tourneyId },
            attributes: [],
          },
        ],
      }),
      // f. Nombre de pools
      Pool.count({
        where: { tourneyId },
      }),
    ]);

    // 3. Structurer les données de réponse
    const counts = {
      users: usersCount,
      fields: fieldsCount,
      sports: sportsList.length,
      teams: teamsCount,
      timeSlotsPerPool: timeSlotsCount,
      pools: poolsCount,
    };

    const sports = sportsList.map((sport) => ({
      id: sport.id,
      name: sport.name,
      color: sport.color,
    }));

    const responseData = {
      tourney,
      counts,
      sports,
    };

    // 4. Envoyer la réponse
    res.status(200).json(responseData);
  } catch (error) {
    console.error('Erreur lors de la récupération des détails du tournoi:', error);
    res.status(500).json({ message: 'Erreur serveur.', error });
  }
};