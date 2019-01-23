<template>
    <div class="ui secondary pointing menu">
        <router-link class="active item" to="/">AppSelector</router-link>

        <div class="right menu">
            <div v-if="isLoggedIn" class="horizontal">
                <router-link class="item" to="/images/gallery">Galleries</router-link>
                <router-link class="item" to="/images/upload">Upload</router-link>
                <a class="item" @click="logout">Logout</a>
            </div>

            <a v-else href="#" class="ui item" @click="login">
                login
            </a>
        </div>
    </div>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex';

    export default{
      name: 'AppHeader',
      methods: mapActions(['login','logout']),
      computed: mapGetters(['isLoggedIn'])
    };
</script>

<style scoped>
    .horizontal{
        display: flex;
        flex-direction: row;
    }
</style>