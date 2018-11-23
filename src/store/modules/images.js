import api from '../../api/imgur';
import qs from 'qs';
import { router } from '../../main.js';


const state = {
  images: []
};

const getters = {
  allImages: state => state.images
};

const actions = {
  async fetchImages({ rootState, commit }) {
    const { token } = rootState.auth;
    const response = await api.fetchImages(token);
    commit('setImages', response.data.data);
  },
  async uploadImages({ rootState }, images) {
    // get the access token
    const { token } = rootState.auth;

    //call imgur API module
    const response = await api.uploadImages(images, token);

    //redirect user image list component
    router.push('/');
  }
};

const mutations = {
  setImages: (state, images) => {
    state.images = images;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
}
