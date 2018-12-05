import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App';
import store from './store/index';
import AuthHandler from './components/imagesApp/AuthHandler';
import ImageList from './components/imagesApp/ImageList';
import UploadForm from './components/imagesApp/UploadForm';
import youtube from './components/youtubeApp/youtube';
import images from './components/imagesApp/Images';
import AppSelector from './components/AppSelector'

Vue.use(VueRouter);

export const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: AppSelector},
    { path: '/oauth2/callback', component: AuthHandler},
    { path: '/youtube', component: youtube},
    { path: '/images', component: images,
      children: [
        {
          // UserProfile will be rendered inside User's <router-view>
          // when /user/:id/profile is matched
          path: '/images/upload',
          component: UploadForm
        },
        {
          // UserProfile will be rendered inside User's <router-view>
          // when /user/:id/profile is matched
          path: '/images/gallery',
          component: ImageList
        }
      ]}

  ]
})

new Vue({
  router: router,
  store:store,
  render: h => h(App)
}).$mount('#app');