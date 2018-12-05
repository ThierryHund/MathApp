import qs from 'qs';
import axios from 'axios'


const CLIENT_ID = '096a3dbaf803427';
const CLIENT_SECRET = 'faf13fcbbdf5ddd11a9f85f6a01ca05969a4a0d0';
const ROOT_URL = 'https://api.imgur.com';

export default {
  login(){
    const querystring = {
      client_id: CLIENT_ID,
      response_type: 'token'
    };
    window.location = `${ROOT_URL}/oauth2/authorize?${qs.stringify(querystring)}`;
  },
  fetchImages(token){
    return axios.get(`${ROOT_URL}/3/account/me/images`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },
  uploadImages(images, token) {
    const promises = Array.from(images).map(image => {
      const formData = new FormData();
      formData.append('image', image);
      return axios.post(`${ROOT_URL}/3/image`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    })
    return Promise.all(promises);
  }
  ,
  deleteImage(image, token) {
    return axios.delete(`${ROOT_URL}/3/image/${image.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    }
};

