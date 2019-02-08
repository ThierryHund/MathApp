<template>
    <div class="home">
        <h1>
            Welcome to GabzApps
        </h1>

        <div class="userInfo message ui" v-for="user in users" :key="user.uid">
            <div class="content">
                <img class="userIcon" :src="user.userIconUrl" />
                <i class="trophy icon"></i>
                <div class="userScore">
                    {{user.userName}} score : {{user.score}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import auth, {db} from '../../firebaseApp/firebaseLauncher.js'

  export default{
    name: 'Home',
    data: function(){
      return {
        users: []
      }
    },
    created(){
      var self = this
      if(auth.user() !== null)
      {
          db.getDocuments("users").then(function(snap){
            snap.forEach((doc) => {
              let data = doc.data();
              if(data.userName != "Anonymous"){
                self.users.push(data)}
              })
          });
      }

    },
    methods: {}
  }
</script>

<style scoped>

    @import url('https://fonts.googleapis.com/css?family=Pacifico');

    .home{
        max-width: 400px;
        margin: auto;
    }

    .userInfo{
        text-align: left;
        width: 100%;
        background-color: #b7d7d8;
        margin: 0px 0 10px 0;
    }

    .content{
        background-color: #b7d7d8;
    }

    .userIcon{
        width: 40px;
        height: 40px;
        border-radius: 20px;
        display: inline-block;
        margin:5px
    }

    h1{
        margin:20px;
        font-family: 'Pacifico', cursive;
    }

    .userScore{
        display:inline-block;
        background-color: #b7d7d8;
    }
</style>
