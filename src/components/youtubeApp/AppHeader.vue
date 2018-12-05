<template>
    <div class="ui secondary pointing menu">
        <router-link class="active item" to="/">AppSelector</router-link>

        <div class="right menu">
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