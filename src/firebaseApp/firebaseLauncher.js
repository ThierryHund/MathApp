import * as firebase from 'firebase/app';
import 'firebase/firestore'
import firebaseui from 'firebaseui';
import {router} from './../main.js';
import config from './firebase.config';


export const db = {
  db: null,
  init() {
      // Initialize Cloud Firestore through Firebase
      this.db = firebase.firestore();
      // Disable deprecated features
      this.db.settings({
        timestampsInSnapshots: true
      });
  },
  setDocument(collection, id, data){
    // Add a new document in collection
    this.db.collection("users").doc(id).set(data)
      .then(function() {
        return true
      })
      .catch(function(error) {
        return false
      });
  },
   getDocument(collection, id){
    let docRef = this.db.collection(collection).doc(id);
    return docRef.get().catch(function(error) {
    });
  },
  getDocuments(collection){
    let docRef = this.db.collection(collection).orderBy("score", "desc");
    return docRef.get()
  }
}

const auth = {
  context: null,
  uiConfig: null,
  ui: null,
  firebasefirstListening: false,
  init() {
      console.log("initAuth")
      firebase.initializeApp(config);
      this.uiConfig = {
        // signInSuccessUrl: '/math',
        signInOptions: [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.EmailAuthProvider.PROVIDER_ID,
        ]
      }
      this.ui = new firebaseui.auth.AuthUI(firebase.auth());
  },
  logAnonymously(){
    firebase.auth().signInAnonymously().then(function(){

    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });
  },
  listen(context){
    this.context = context;
    firebase.auth().onAuthStateChanged((user) => {
      this.firebasefirstListening = true
      this.context.$store.dispatch('setCurrentUser')
      let requireAuth = this.context.$route.matched.some(record => record.meta.requireAuth)
      let guestOnly = this.context.$route.matched.some(record => record.meta.guestOnly)
      if (requireAuth && !user) this.context.$router.push('/math/auth')
      else if (guestOnly && user) this.context.$router.push('/math')
    });
  },
  authForm(container) {
    this.ui.start(container, this.uiConfig);
  },
  user() {
    return this.context ? firebase.auth().currentUser : null;
  },
  async logout() {
    await firebase.auth().signOut();
    router.push('/math');
  }
}

export default auth;