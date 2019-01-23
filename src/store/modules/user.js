import auth, {db} from '../../firebaseApp/firebaseLauncher.js'

const state = {
  uid : null,
  userName: null,
  score : null,
  lastConnexion : null,
  userIconUrl : null
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
        state.userName = user.displayName;
        state.userIconUrl = user.photoURL;
        // state.lastConnexion = user.lastConnexion;
      }
      //retrieve data from firestore (score, last connexion date)
      let data = await db.getDocument("users", state.uid);

      if (data.exists) {
        data = data.data()
        state.lastConnexion = data.lastConnexion;
        state.score = data.score ? data.score : 0;
      }
      else
      {
        //create first user
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
    }
  },
  UpdateScore(state){
    state.score = state.score + 1
    db.setDocument("users", state.uid, state)
  }
}

const actions = {
  setCurrentUser: ({ commit }) => {
    commit('setUser', auth.user())
  },
  updateScore: ({ commit }) => {
    commit('UpdateScore')
  }
}

export default {
  //namespaced: true,
  state,
  getters,
  mutations,
  actions
}