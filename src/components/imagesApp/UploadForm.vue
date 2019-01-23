<template>
    <div>
    <div class="dropper" v-bind:class="{ loading: !loader }">
        <input  type="file"
               @change="upload($event.target.files)"
                multiple
               accept="image/*"
        />
        <span>Drag files here!</span>
    </div>
    <div class="loader" v-bind:class="{ loading: loader }">
        <img src="https://media.giphy.com/media/tXL4FHPSnVJ0A/giphy.gif">
    </div>
    </div>
</template>

<script>
  import { mapActions } from 'vuex';

  export default{
    name: 'UploadForm',
    data: function(){
      return {
        loader: false
      }
    },
    methods: {
      ...mapActions(['uploadImages']),
      upload: function(files){
        this.loader = true
        this.uploadImages(files).then(() => {this.loader = false})
      }
    }
  }
</script>

<style scoped>
    .dropper{
        border-radius: 5px;
        height: 30vh;
        border: 2px dashed black;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        transition: opacity 1s ease-in-out;
        opacity: 0;
        z-index: 100;

    }

    .dropper:hover{
        background-color: #eee;
    }

    input{
        width: 100%;
        height: 100%;
        position: absolute;
        opacity: 0;
    }

    .loader{
        padding: 5px;
        transition: opacity 1s ease-in-out;
        border-radius: 5px;
        display: block;
        justify-content: center;
        align-items: center;
        position: relative;
        margin: auto;
        opacity: 0;
        display: flex;
        justify-content: center; /* align horizontal */
        align-items: center;
    }

    .loading {
        opacity : 1;
    }
</style>