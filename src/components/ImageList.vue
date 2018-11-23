<template>
    <div>
        <div v-if="isLoggedIn" class="image-container">
            <img v-for="image in allImages" :src="image.link">
        </div>
        <h2 v-else>Please log in to see you images !</h2>
    </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';

  export default{
    name: 'ImageList',
    methods: mapActions(['fetchImages']),
    created() {
      this.fetchImages();
    },
    computed: mapGetters(['allImages', 'isLoggedIn'])

  }
</script>

<style scoped>
    .image-container{
        column-count: 3;
        column-gap: 0;
    }
    img{
        max-width: 100%;
        padding: 5px;
    }
</style>