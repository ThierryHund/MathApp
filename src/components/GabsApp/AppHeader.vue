<template>
    <header class="header">

        <div class="wrap">
            <h2 class="logo"><router-link class="" to="/">Apps</router-link></h2>

            <a id="menu-icon" @click="isMenuDeployed = !isMenuDeployed">&#9776; Menu</a>

            <nav class="navbar isMenuDeployed" :class="{expand : isMenuDeployed}">
                <ul class="menu">
                    <li :class="{hidden : !isLogged}" @click="isMenuDeployed = false">
                        <router-link class="item" to="/math" @click="isMenuDeployed = false">
                            Home
                        </router-link>
                    </li>
                    <li :class="{hidden : !isLogged}" @click="isMenuDeployed = false">
                        <router-link class="item" to="/math/addition" @click="isMenuDeployed = false">
                            add/sous
                        </router-link>
                    </li>
                    <li :class="{hidden : !isLogged}" @click="isMenuDeployed = false">
                        <router-link class="item" to="/math/tables" @click="isMenuDeployed = false">tables
                        </router-link>
                    </li>
                    <li :class="{hidden : !isLogged}" @click="isMenuDeployed = !isMenuDeployed">
                        <router-link class="item" to="/math/challenge" @click="isMenuDeployed = !isMenuDeployed">Challenges
                        </router-link>
                    </li>
                    <li :class="{hidden : !isLogged}" @click="isMenuDeployed = false; logout()">
                        <router-link class="item" to="/math" @click="isMenuDeployed = false">Logout
                        </router-link>
                    </li>
                    <li :class="{hidden : isLogged}" @click="isMenuDeployed = false">
                        <router-link class="item" to="/math" @click="isMenuDeployed = false">Login
                        </router-link>
                    </li>
                </ul>
            </nav>
        </div>
    </header>
</template>

<script>
  import auth from '../../firebaseApp/firebaseLauncher.js'

  export default {
    name: 'AppHeader',
    data: function () {
      return {
        isMenuDeployed: false,
      }
    },
    computed:{
      isLogged(){
        return this.$store.getters.user.uid !== null
      }
    },
    methods: {
      logout(){
        auth.logout();
      }
    }
  };
</script>

<style scoped>

    @import url(https://fonts.googleapis.com/css?family=Nunito);
    *, *:before, *:after {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    .hidden{
        display: none
    }

    html {
        font-size: 100%;
        font-family: "Nunito", Arial, sans-serif;
        font-weight: normal;
        line-height: 1.5;
        -webkit-font-smoothing: antialiased;
    }

    a{
        color: indianred;
        opacity: 1;
        text-decoration: none;
    }

    a:hover {
        opacity: 0.85;
        text-decoration: underline;
    }

    /* Navigation Styles */
    /* Header */
    .header {
        position: relative;
        width: 100%;
        background: indianred;
        height: 50px;
        line-height: 50px;
        box-shadow: 0 -3px 0 #bc3a3a inset;
        /*margin-bottom: 20px;*/
    }

    .wrap {
        max-width: 960px;
        /* Changge this with your max-width size */
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
    }

    .logo {
        font-family: inherit;
        font-size: 1rem;
        margin-left: 1em;
        text-align: left;
        line-height: 48px;
    }

    .logo a {
        color: #fff;
        text-decoration: none;
        opacity: 1;
    }

    .logo a:hover {
        opacity: 0.85;
    }

    /* Mobile menu */
    #menu-icon {
        display: block;
        position: absolute;
        top: 0;
        right: 1.5em;
        color: #fff;
        text-decoration: none;
        font-weight: bold;
        cursor: pointer;
        opacity: 1;
        padding: 0 0.4em;
    }

    #menu-icon:hover {
        opacity: 0.85;
        text-decoration: none;
        border: none;
    }

    .navbar {
        background-color: indianred;
        float: none;
        max-height: 0;
        overflow: hidden;
        margin-bottom: 20px;
    }

    .navbar .menu {
        margin: 0;
        padding: 0;
        list-style-type: none;
        width: 100%;

    }

    .navbar .menu li {
        list-style-type: none;
        display: block;
    }

    .navbar .menu li a {
        display: block;
        text-decoration: none;
        color: #fff;
        padding: 0 0.8em;
        border-bottom: 1px solid #db8b8b;
    }

    .navbar .menu li a:hover {
        background-color: #df9797;
    }

    .navbar .menu li a.active {
        background-color: #d98383;
    }

    @media (max-width: 500px) {

        .navbar{
            width:100%;
            /*height: 0;*/
            -webkit-transition: max-height 0.5s ease-in; /* Safari */
            transition: max-height 0.5s ease-in;
            z-index: 2000;
            position: absolute;
            width: 100%;
            margin-top: 3.6em;

        }

        .expand {
            /*height:14.5em;*/
            max-height: 20em;
            margin-top: 3.6em;
            z-index: 1001;
        }
    }

    .hidden{
        display: none!important;
    }

    @media only screen and (min-width: 500px) {
        .wrap {
            padding-left: 1em;
            padding-right: 1em;
        }

        .logo {
            margin-left: 0;
        }

        .logo, .navbar {
            display: inline-block;
        }

        /* Mobile menu icon */
        #menu-icon {
            display: none;
        }

        .navbar {
            float: right;
            max-height: none;
            z-index: 2000;
        }

        .navbar .menu {
            box-shadow: 0 -3px 0 #bc3a3a inset;
        }

        .navbar .menu li {
            list-style-type: none;
            display: inline-block;
            text-align: center;
        }

        .navbar .menu li a {
            display: block;
            border-bottom: 0;
        }

        .navbar .menu li a:hover {
            box-shadow: 0 -3px 0 indianred inset;
        }

        .navbar .menu li a.active {
            box-shadow: 0 -3px 0 indianred inset;
        }

        .hidden{
            display: none!important;
        }
    }

    .slide-in-top{
        -webkit-animation: slide-in-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
        animation: slide-in-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
    }

    /* ----------------------------------------------
 * Generated by Animista on 2019-1-24 16:58:3
 * w: http://animista.net, t: @cssanimista
 * ---------------------------------------------- */

    /**
     * ----------------------------------------
     * animation slide-in-top
     * ----------------------------------------
     */
    @-webkit-keyframes slide-in-top {
        0% {
            -webkit-transform: translateY(-1000px);
            transform: translateY(-1000px);
            opacity: 0;
        }
        100% {
            -webkit-transform: translateY(0);
            transform: translateY(0);
            opacity: 1;
        }
    }
    @keyframes slide-in-top {
        0% {
            -webkit-transform: translateY(-1000px);
            transform: translateY(-1000px);
            opacity: 0;
        }
        100% {
            -webkit-transform: translateY(0);
            transform: translateY(0);
            opacity: 1;
        }
    }


</style>