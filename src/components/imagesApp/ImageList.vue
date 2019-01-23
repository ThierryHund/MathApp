<template>
        <div v-if="isLoggedIn" class="image-container">
            <div class="ui card " v-for="image in allImages" :key="image.id">
                <div class="image">
                    <img :src="image.link">
                </div>
                <div class="content" v-if="image.title !== null">
                    <div class="description">
                        {{image.title}}
                    </div>
                </div>
                <div class="extra content">
                    <div class="action" @click="deleteImage(image)">
                        X
                    </div>
                    <div class="action" @click="editImage(image)">
                        E
                    </div>
                </div>
            </div>
        </div>
        <h2 v-else>Please log in with your Imgur account to see your images !</h2>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';

  export default{
    name: 'ImageList',
    methods: mapActions(['fetchImages', 'deleteImage', 'editImage']),
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
        position: relative;
    }

    .ui.card>.extra, .ui.cards>.card>.extra.content{
        position: absolute!important;
        opacity: 1;
        width:100%;
        display: none;
        flex-direction: row;
        height: 50px;
        z-index: 100;
        text-align: center;
        bottom: 0;
        /*float: bottom;*/
    }

    .card:hover  > .extra.content{
        display: flex;
        justify-content: space-evenly;
    }

    .card:hover .action{
        cursor: pointer;
    }

    .card:hover >  .image {
        opacity: 0.5;
    }

    .extra > .action{
        line-height: 100%;
        font-size: xx-large;
        color: #eee;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        border: 5px solid #eee;
    }
</style>