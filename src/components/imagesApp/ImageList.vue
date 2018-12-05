<template>
        <div v-if="isLoggedIn" class="image-container">
            <!--<img class="ui card link" v-for="image in allImages" :key="image.id" :src="image.link" @click="deleteImage(image)">-->
            <div class="ui card link" v-for="image in allImages" :key="image.id">
                <div class="image">
                    <img :src="image.link">
                </div>
                <div v-if="image.title !== null" class="content">
                    <div class="description">
                        {{image.title}}
                    </div>
                </div>
                <div class="extra">
                    <div class="action" @click="deleteImage(image)">
                        X
                    </div>
                    <div class="action">
                        edit
                    </div>
                </div>
            </div>
        </div>
        <h2 v-else>Please log in to see you images !</h2>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';

  export default{
    name: 'ImageList',
    methods: mapActions(['fetchImages', 'deleteImage']),
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

    .card{
        break-inside: avoid-column;
    }

    .extra {
        position: absolute;
        display: none;
        width:100%;
        height: 100%;
        z-index: 100;
        text-align: center;
        justify-content: center;
        align-content: center;
        vertical-align: center;
    }

    .extra > span{
        line-height: 100%;
        font-size: xx-large;
        color:#eee;
    }

    .card:hover >  .extra {
        display: block;
        z-index: 1000;
    }

    .card:hover >  .image {
        opacity: 0.5;
    }

    .extra > .action{
        border-radius: 50%;
        width:50px;
        height: 50px;
        border: 5px solid #eee;
    }
</style>