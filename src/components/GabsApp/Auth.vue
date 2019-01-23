<template>
    <div>
        <h1>Sign in</h1>
        <div id="firebaseui-auth-container"></div>
        <button class="ui primary button" @click="logAnonymously">anonymous user</button>
    </div>
</template>

<script>
  import auth from '../../firebaseApp/firebaseLauncher.js';
  import {router} from '../../main.js';


  export default {
    name: 'Auth',
    data: function () {
      return {
        guestUser: null
      }
    },
    mounted() {
      auth.authForm('#firebaseui-auth-container')
    },
    methods: {
      onSubmit() {
        this.guestUser = this.guestUser.toLowerCase();

        //TODO manage anonymous user to avoid connexion
        // firebase.auth().signInAnonymously().catch(function(error) {
        //   // Handle Errors here.
        //   var errorCode = error.code;
        //   var errorMessage = error.message;
        //   // ...
        // });
        // this.$store.dispatch('setCurrentUser', { ConnexionMode : 2, user : this.guestUser })
        router.push('/math');
      },
      logAnonymously(){
        auth.logAnonymously()
      }
    },
  }
</script>

<style scoped>
button{
    direction: ltr;
    font-weight: 500;
    height: auto;
    line-height: normal;
    max-width: 220px;
    min-height: 40px;
    padding: 8px 16px;
    text-align: left;
    width: 100%;
}
</style>