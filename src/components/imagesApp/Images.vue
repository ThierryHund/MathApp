<template>
    <div class="container">
        <AppHeader></AppHeader>
        <div class="ui container">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    import AppHeader from './AppHeader'
    export default{
      name: 'App',
      components: {
        AppHeader
      }
    }
</script>
