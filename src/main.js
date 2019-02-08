
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
import Math from './components/GabsApp/Math';
import Addition from './components/GabsApp/Addition';
import Tables from './components/GabsApp/Tables';
import Home from './components/GabsApp/Home';
import Auth from './components/GabsApp/Auth';
import Challenge from './components/GabsApp/Challenge';
import auth , { db } from './firebaseApp/firebaseLauncher.js'
import * as firebase from "firebase/app";


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
      ]},
    // { path: '/math/auth_success', component: Math},
    { path: '/math', component: Math,
      children: [
        {
          // UserProfile will be rendered inside User's <router-view>
          // when /user/:id/profile is matched
          path: '/math',
          component: Home,
          meta: { requireAuth: true }
        },
        {
          // UserProfile will be rendered inside User's <router-view>
          // when /user/:id/profile is matched
          path: '/math/addition',
          component: Addition,
          meta: { requireAuth: true }
        },
        {
          // UserProfile will be rendered inside User's <router-view>
          // when /user/:id/profile is matched
          path: '/math/tables',
          component: Tables,
          meta: { requireAuth: true }
        },
        {
          // UserProfile will be rendered inside User's <router-view>
          // when /user/:id/profile is matched
          path: '/math/auth',
          component: Auth,
          meta: { guestOnly: true }
        },
        {
          // UserProfile will be rendered inside User's <router-view>
          // when /user/:id/profile is matched
          path: '/math/challenge',
          component: Challenge,
          meta: { requireAuth: true }
        }
    ]}
  ]
})

//initialize Firebase
auth.init()
db.init()


router.beforeEach((to, from, next) => {
    let currentUser = firebase.auth().currentUser;
    let requireAuth = to.matched.some(record => record.meta.requireAuth)
    let guestOnly = to.matched.some(record => record.meta.guestOnly)
    if (requireAuth && !currentUser) next('/math/auth')
    else if (guestOnly && currentUser) next('/math/')
    else next()
})


Vue.use(VueRouter);

setTimeout(()=>{
  new Vue({
    router: router,
    store:store,
    beforeCreate:function(){
      auth.listen(this)
    },
    data: function () {
      return {
        user: null
      }
    },
    render: h => h(App)
  }).$mount('#app');
}, 500);



