<template>
    <div class="container">
        <AppHeader></AppHeader>
        <h3>CustomCrazyYoutubeInterfaces</h3>
        <SearchBar @termChange="onTermChange"></SearchBar>
        <div class="row">
            <VideoDetail :video="selectedVideo" />
            <videoList :videos="videos" @videoSelect="onVideoSelect"></videoList>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import SearchBar from './SearchBar';
    import VideoList from './VideoList';
    import VideoDetail from './VideoDetail';
    import AppHeader from './AppHeader';

    const API_KEY = 'AIzaSyDdh6dBgQ8NiLeK7oZuh2dPzr84J72KdlM';
    export default {
      name: 'App',
      components: {SearchBar: SearchBar, VideoList: VideoList, VideoDetail:VideoDetail, AppHeader:AppHeader},
      data: function(){
        return {
            videos: [],
            selectedVideo: null
        }
      },
      methods: {
        onTermChange: function(searchTerm){
            axios.get('https://www.googleapis.com/youtube/v3/search', {
              params : {
                key: API_KEY,
                type: 'video',
                part: 'snippet',
                q: searchTerm
              }
            }).then(response => {
              this.videos = response.data.items
            })
        },
        onVideoSelect(video){
            this.selectedVideo = video
        }
      }
    };
</script>

<style scoped>
    div{
        text-align: center;
    }
</style>