<template>
    <div>
        <h1>Sign in</h1>
        <div id="firebaseui-auth-container"></div>
        <div class="ui message disclaimer">
            <strong>This Math training app allows you to sign in with a Google Account or anonymously through the guest button</strong>
            <p>If you logged in with Google, your score will be displayed on the home screen.</p>
        </div>


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

    .disclaimer{
        text-align: left;
        max-width: 360px;
        margin: auto;
    }
</style>