<template>
    <div class="appSpotContainer">
        <div class="appSpot">
            <router-link class="item images" title="ImagesApp" to="/images/gallery"></router-link>
        </div>
        <div class="appSpot">
            <router-link class="item youtube" title="YoutubeApp" to="/youtube"></router-link>
        </div>
        <div class="appSpot">
            <router-link class="item math" title="MatheApp" to="/math">+</router-link>
        </div>
    </div>
</template>

<script>
  export default {
      name: 'AppSelector',
      methods: {

        }
    };
</script>

<style scoped>

    .appSpotContainer{
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .appSpot{
        border-radius: 50%;
        width:20vw;
        height: 20vw;
        display: flex;
        background-color: #9fa6ff;
        align-items: center;
        justify-content: center;
        margin: 20px;
        transition: background-color 100ms linear;
    }

    a{
        text-align: center;
        text-decoration: none;
        color: black;
        display: block;
        line-height: 20vw;
        width:100%;
    }

    @media screen and (min-width: 480px) {
        .appSpot {
            width:100px;
            height: 100px
        }

        a{
            line-height: 100px;
        }
    }


    .youtube{
        background: url(http://www.slatecube.com/images/play-btn.png);
        width:100%;
        height: 100%;
        background-size: 50px 50px;
        background-repeat: no-repeat;
        background-position: center;
    }

    .images{
        background: url(https://cdn2.iconfinder.com/data/icons/picol-vector/32/image-512.png);
        width:100%;
        height: 100%;
        background-size: 50px 50px;
        background-repeat: no-repeat;
        background-position: center;
    }

    .math{
        font-size: xx-large;
        width:100%;
        height: 100%;
        background-size: 50px 50px;
        background-repeat: no-repeat;
        background-position: center;
    }

    .appSpot:hover{
        background-color: #ff946d;
    }
</style>