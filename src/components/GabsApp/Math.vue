<template>
    <div class="ui center aligned container root">
        <AppHeader></AppHeader>
        <div class="ui container" >
            <router-view
                    @updateScore="onUpdateResult"
            >
                    <!--@userAuth="userAuth"-->
                    <!--@userScore="onUserScore"-->
            </router-view>
        </div>
    </div>
</template>

<script>
  import AppHeader from './AppHeader';


  export default {
    name: 'Math',
    components: {
      AppHeader
    },
    data: function () {
      return {
        isLoggedIn: false,
        user: "",
        userScore: 0,
        userName: null,
        userIconUrl: null,
        lastConnexion: null,
        uid:null
      }
    },
    computed: {
      userLogged() {
        return this.$store.getters.user
      }
    },
    created(){
      let user =  this.$store.getters.user
      this.userName = user.userName
      this.userScore = user.score
      this.userIconUrl = user.userIconUrl
      this.lastConnexion= user.lastConnexion
      this.uid = user.uid
    },
    filters: {
      capitalize: function (value) {
        if (!value) return ''
        value = value.toString()
        return value.toUpperCase()
      }
    },
    mounted() {
    },
    methods: {
      // userAuth(user){
      //   this.isLoggedIn = true;
      //   this.user = user.displayName;
      // },
      // onSubmit() {
      //   this.user = this.user.toLowerCase();
      //   this.isLoggedIn = true;
      //   this.getResult();
      //   router.push('/math/addition');
      //
      // },
      // onUserScore(score) {
      //   this.storeUserData(score)
      // },
      onUpdateResult() {
        // this.userScore = this.userScore + 1;
        // this.storeUserData(this.userScore)
        this.$store.dispatch('updateScore')
      },
      storeUserData(userScore) {
        let myObj = {score: userScore};
        let myJSON = JSON.stringify(myObj);
        window.localStorage.setItem("gabs_app" + "-" + this.user, myJSON);
      },
      cleanResult() {
        window.localStorage.removeItem("gabs_app" + "-" + this.user);
      },
      getResult() {
        let text = window.localStorage.getItem("gabs_app" + "-" + this.user);
        if (text !== null) {
          let obj = JSON.parse(text);
          if (obj.hasOwnProperty('score')) {
            this.userScore = obj.score;
          }
        }
      }
    }
  }
</script>

<style scoped>
    .userInfo {
        text-align: left !important;
        width: 100%;
        border: #eee solid 2px;
        border-radius: 5px;
        padding: 5px;
        margin: 5px 0 10px 0;
    }

    /*.container.root{*/
    /*background-color: #dad1d5;*/
    /*}*/

    .labelled {
        display: flex;
        /* flex-direction: column;*/
        align-items: stretch;
        justify-content: center;
        min-height: 100%;
        margin-bottom: 10px;

    }

    .labelled .label {
        /*height: 100%;*/
        border-bottom-right-radius: 0px;
        border-top-right-radius: 0px;
        margin-right: 0px;
        flex-grow: 1;
        vertical-align: middle;
        display: flex;
        align-items: center;
    }

    .labelled input {
        border-bottom-left-radius: 0px;
        border-top-left-radius: 0px;
        flex-grow: 1;
    }

    .button {
        width: 100%;
    }

    .container.ui.root {
        display: inline-block;
        position: relative;
        width: 100% !important;
        margin: 0 0 0 0 !important;
        padding: 0 0 0 0 !important;
        /*margin: 0 25vw 0 25vw!important;*/
    }

    @media (max-width: 480px) {
        .container.ui.root {
            width: 100% !important;
            display: inline-block;
            position: relative;
            /*width: 50vw;*/
            margin: 0 0 0 0 !important;
            padding: 0 0 0 0 !important;
        }
    }

    @media screen and (min-width: 480px) {
        .container.ui.root {
            width: 100% !important;
            display: inline-block;
            position: relative;
            margin: 0 0 0 0 !important;
            padding: 0 0 0 0 !important;
            /*width: 50vw;*/
            /*margin: 0 25vw 0 25vw!important;*/
        }
    }
</style>
