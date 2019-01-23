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
    //router.push('/');
  },
  async deleteImage({ rootState, commit }, image) {
    const { token } = rootState.auth;
    const response = await api.deleteImage(image, token);
    if(response.data.success === true)
    {
      commit('removeImage', [image])
    }
  },
  async editImage({ rootState, commit }, image) {
    const { token } = rootState.auth;
    const response = await api.editImage(image, token);
    if(response.data.success === true)
    {
      //commit('removeImage', [image])
    }
  }
};

const mutations = {
  setImages: (state, images) => {
    state.images = images;
  },
  removeImage (state, image) {
    let i = state.images.map(item => item.id).indexOf(image[0].id) // find index of your object
    state.images.splice(i, 1)    //state.images.$remove(image)
  }
};

export default {
  state,
  getters,
  actions,
  mutations
}
