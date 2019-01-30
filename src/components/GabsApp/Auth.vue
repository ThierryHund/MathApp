<template>
    <div>
        <h1>Sign in</h1>
        <div id="firebaseui-auth-container"></div>
        <!--<button class="ui primary button" @click="logAnonymously">anonymous user</button>-->
    </div>
</template>

<script>
  import auth from '../../firebaseApp/firebaseLauncher.js';

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