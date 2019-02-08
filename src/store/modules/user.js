import auth, {db} from '../../firebaseApp/firebaseLauncher.js'

const state = {
  uid : null,
  userName: null,
  score : null,
  lastConnexion : null,
  userIconUrl : null,
  challenge : []
}

const getters = {
  user: state => state,
}

const mutations = {
  async setUser(state, user){
    if(user != null)
    {
      state.uid = user.uid;
      if (user.isAnonymous) {
        state.userName = "Anonymous";
        state.userIconUrl = require("../../asset/anonymous-icon.jpg");
      }
      else {
        state.userName = user.providerData[0].displayName;
        state.userIconUrl = user.photoURL;
        // state.lastConnexion = user.lastConnexion;
      }
      //retrieve data from firestore (score, last connexion date)
      let data = await db.getDocument("users", state.uid);

      if (data.exists) {
        data = data.data()
        state.lastConnexion = data.lastConnexion;
        state.score = data.score ? data.score : 0;
        state.challenge = data.challenge ? data.challenge : [];
      }
      else
      {
        //create first user
        state.score = 0
        state.challenge =  [];
        db.setDocument("users", state.uid, state)
      }
    }
    else
    {
      state.uid = null;
      state.userName = null;
      state.lastConnexion = null;
      state.userIconUrl = null;
      state.score = 0
      state.challenge =  [];
    }
  },
  UpdateScore(state, point){
    state.score = parseInt(state.score) + parseInt(point)
    db.setDocument("users", state.uid, state)
  },
  challengeVictory(state, payload){
    state.score = parseInt(state.score) + parseInt(payload.point)
    state.challenge.push(payload.challengeRules)
    db.setDocument("users", state.uid, state)
  },
}

const actions = {
  setCurrentUser: ({ commit }) => {
    commit('setUser', auth.user())
  },
  updateScore: ({ commit }, point) => {
    commit('UpdateScore', [point])
  },
  challengeVictory({ commit }, payload){
    commit('challengeVictory', payload)
  }
}

export default {
  //namespaced: true,
  state,
  getters,
  mutations,
  actions
}