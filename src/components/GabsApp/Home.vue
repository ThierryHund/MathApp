<template>
    <div class="home">
       Welcome to GabzApps

        <div class="ui icon message userInfo" v-for="(user, index) in users" :key="user.uid">
            <div class="content">
                <img class="userIcon" :src="user.userIconUrl" />
                <i class="trophy icon"></i>
                <div class="userScore">
                    {{user.userName}} score : {{user.score}}
                </div>
            </div>
        </div>
        <!--<div v-for="(user, index) in users" :key="user.uid">-->
            <!--{{user.userName}} : {{user.score}}-->
        <!--</div>-->
    </div>
</template>

<script>
  import {db} from '../../firebaseApp/firebaseLauncher.js'

  export default{
    name: 'Home',
    data: function(){
      return {
        users: []
      }
    },
    created(){
      var self = this
      let data = db.getDocuments("users").then(function(snap){
        snap.forEach((doc) => {
          self.users.push(doc.data())
          //console.log(doc.id, " => ", doc.data());
        });
      });

    },
    methods: {}
  }
</script>

<style scoped>
    .userIcon{
        width: 40px;
        height: 40px;
        border-radius: 20px;
        display: inline-block;
        margin:5px
    }

    .userScore{
        display:inline-block;
    }
</style>
