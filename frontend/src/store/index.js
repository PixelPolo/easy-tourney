import { createStore } from 'vuex';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Import the 'jwtDecode' function
import tourney from './modules/tourney';

export default createStore({
  modules: {
    tourney,
  },
  state: {
    isAuthenticated: !!localStorage.getItem('token'), // On vérifie si un token est déjà présent
    user: null,
  },
  mutations: {
    SET_AUTH(state, payload) {
      state.isAuthenticated = payload.isAuthenticated;
      state.user = payload.user;
    },
    LOGOUT(state) {
      state.isAuthenticated = false;
      state.user = null;
    },
    SET_ALERT_MESSAGE(state, message) {
      state.alertMessage = message;
    },
    CLEAR_ALERT_MESSAGE(state) {
      state.alertMessage = null;
    },
  },
  actions: {
    async login({ commit }, { email, password }) {
      try {
        const response = await axios.post('/api/auth/login', { email, password });
        const token = response.data.token;

        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        commit('SET_AUTH', { isAuthenticated: true, user: response.data.user });

      } catch (error) {
        console.error('Erreur de connexion:', error);
        throw error;
      }
    },
    logout({ commit }) {
      localStorage.removeItem('token');  // Supprime le token de localStorage
      delete axios.defaults.headers.common['Authorization'];  // Supprime l'en-tête d'autorisation

      commit('LOGOUT');  // Réinitialise l'état
    },

    // Nouvelle action pour restaurer l'état d'authentification à partir du token
    initializeAuth({ commit }) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          commit('SET_AUTH', {
            isAuthenticated: true,
            user: decoded,
          });
        } catch (error) {
          console.error("Erreur lors du décodage du token:", error);
        }
      }
    },
  }
});
