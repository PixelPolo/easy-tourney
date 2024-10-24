const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams pour accéder à tourneyId
const {
  addUserToTourney,
  getUsersByTourney,
  removeUserFromTourney,
  getUserInfoByTourney,
  getUnassignedUsersByTourney
} = require('../controllers/usersTourneysController');
const { isAuthenticated, isAdmin } = require('../middlewares');

// Routes pour gérer les utilisateurs d'un tournoi
// Base URL: http://localhost:3000/api/tourneys/:tourneyId/users

router.post('/', isAuthenticated, isAdmin, addUserToTourney); // Ajouter un utilisateur à un tournoi
router.get('/', isAuthenticated, getUsersByTourney); // Récupérer tous les utilisateurs du tournoi (hors admin)
router.get('/unassigned-users', isAuthenticated, getUnassignedUsersByTourney); // Récupérer les utilisateurs sans team pour un tournoi donné
router.get('/:userId', isAuthenticated, getUserInfoByTourney); // Récupérer les informations d'un utilisateur pour un tournoi donné
router.delete('/:userId', isAuthenticated, isAdmin, removeUserFromTourney); // Supprimer un utilisateur d'un tournoi

module.exports = router;
