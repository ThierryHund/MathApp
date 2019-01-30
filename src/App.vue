<template>
    <div>
        <router-view></router-view>
    </div>
</template>

<script>
  export default{
      name: 'App',
      data: function() {
        return {
          user: ""
        }
      },
    beforeCreate() {
    },
      components: {

      }
    }
</script>

<style>
    body{
        background-color: #eae2de;
    }
</style>
