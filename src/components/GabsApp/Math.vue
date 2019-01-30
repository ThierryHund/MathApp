<template>
    <div class="ui center aligned container root">
        <AppHeader></AppHeader>
        <div class="userInfo" v-bind:class="{'shake-horizontal' : scoreIsUpdated}" v-if="this.$router.currentRoute.fullPath != '/math' && this.$router.currentRoute.fullPath != '/math/auth'">
            <div class="content">
                <img class="userIcon" :src="userLogged.userIconUrl" />
                <i class="trophy icon"></i>
                <div class="userScore">
                    {{userLogged.userName}} score : {{!isNaN(userLogged.score) ? userLogged.score : 0 }}
                </div>
            </div>
        </div>
        <div class="ui container" >
            <router-view @updateScore="onUpdateResult">
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
        uid:null,
        scoreIsUpdated : false
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
      onUpdateResult(point) {
        this.$store.dispatch('updateScore', point)
        this.scoreIsUpdated = true
        setTimeout(()=>{this.scoreIsUpdated = false}, 2000)
      },
    }
  }
</script>

<style scoped>

    .userIcon{
        width: 40px;
        height: 40px;
        border-radius: 20px;
        display: inline-block;
        margin:5px
    }

    .userScore{
        display:inline-block;
    }

    .userInfo {
        text-align: left;
        width: 100%;
        /*border: #eee solid 2px;*/
        background-color: #B7D7D8;
        /*border-radius: 5px;*/
        /*padding: 5px;*/
        margin: 0px 0 10px 0;
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

    .container.ui.root {
        display: inline-block;
        position: relative;
        width: 100% !important;
        margin: 0 0 0 0 !important;
        padding: 0 0 0 0 !important;
    }

    @media (max-width: 480px) {
        .container.ui.root {
            width: 100% !important;
            display: inline-block;
            position: relative;
            margin: 0 0 0 0 !important;
            padding: 0 0 0 0 !important;
        }
    }

    /************************************/
    /********   No Mobile   *************/
    /************************************/

    @media screen and (min-width: 480px) {
        .container.ui.root {
            width: 100% !important;
            display: inline-block;
            position: relative;
            margin: 0 0 0 0 !important;
            padding: 0 0 0 0 !important;
        }
    }

    /************************************/
    /******  Animation class  ***********/
    /************************************/

    .shake-horizontal {
        -webkit-animation: shake-horizontal 0.8s cubic-bezier(0.455, 0.030, 0.515, 0.955) both;
        animation: shake-horizontal 0.8s cubic-bezier(0.455, 0.030, 0.515, 0.955) both;
    }

    @-webkit-keyframes shake-horizontal {
        0%,
        100% {
            -webkit-transform: translateX(0);
            transform: translateX(0);
        }
        10%,
        30%,
        50%,
        70% {
            -webkit-transform: translateX(-10px);
            transform: translateX(-10px);
        }
        20%,
        40%,
        60% {
            -webkit-transform: translateX(10px);
            transform: translateX(10px);
        }
        80% {
            -webkit-transform: translateX(8px);
            transform: translateX(8px);
        }
        90% {
            -webkit-transform: translateX(-8px);
            transform: translateX(-8px);
        }
    }

    @keyframes shake-horizontal {
        0%,
        100% {
            -webkit-transform: translateX(0);
            transform: translateX(0);
        }
        10%,
        30%,
        50%,
        70% {
            -webkit-transform: translateX(-10px);
            transform: translateX(-10px);
        }
        20%,
        40%,
        60% {
            -webkit-transform: translateX(10px);
            transform: translateX(10px);
        }
        80% {
            -webkit-transform: translateX(8px);
            transform: translateX(8px);
        }
        90% {
            -webkit-transform: translateX(-8px);
            transform: translateX(-8px);
        }
    }
</style>
