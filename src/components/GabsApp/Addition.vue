<template>
    <div class="module_container">
        <div class="ui icon message userInfo">
            <div class="content">
                <img class="userIcon" :src="userLogged.userIconUrl" />
                <i class="trophy icon"></i>
                <div class="userScore">
                    {{userLogged.userName}} score : {{!isNaN(userLogged.score) ? userLogged.score : 0 }}
                </div>
            </div>
        </div>
        <div class="calcul">
            <div class="row">
                <div class="figure" v-for="(nb1, index) in number1Array"
                     :key="index"
                     v-bind:class="{ vibrate : bzzz }">
                        <p>{{nb1}}</p>
                        <div v-if="index !=  number1Array.length - 1" class="retained" @click="addRetained(index)">{{retained[index]}}</div>
                </div>
            </div>
            <div class="last row">
                <div class="figure" v-for="(nb2, index) in number2Array"
                     :key="index"
                     v-bind:class="{ vibrate : bzzz }">
                    <p>{{nb2}}</p>
                </div>
            </div>
            <div class="separator"></div>
            <form v-on:submit.prevent="">
                <div class="result">
                    <input ref="digit" class="figure"
                           v-bind:class="{ success: success, error: error, vibrate : bzzz }"
                           :disabled="success" v-for="(digit, index) in maxDigit"
                           :key="index" type="number"  pattern="[0-9]" v-model="userResultArray[index]"
                           @keydown="limitToOneDigit($event, index)"
                           min="0"
                           max="9">
                </div>
                <button v-if="!success" type="submit" class="ui primary button" @click="checkResult()">Check result</button>
                <button v-bind:type="success ? 'submit' : ''" class="ui primary button" @click="nextCalcul()">Next</button>
            </form>
        </div>
    </div>
</template>

<script>
  export default{
    name: 'Addition',
    data: function(){
      return {
        isLoggedIn: false,
        number1: null,
        number2: null,
        number1Array: [],
        number2Array: [],
        maxDigit: null,
        userResultArray: [],
        expectedResult: null,
        expectedResultArray: [],
        retained:[],
        error: false,
        success: false,
        bzzz: false
      }
    },
    mounted(){
      this.initializeData();
    },
    directives: {
      focus: {
        inserted: function (el) {
          el.focus()
        }
      }
    },
    computed: {
      userLogged() {
        return this.$store.getters.user
      }
    },
    methods: {
      initializeData(){
        this.error = false;
        this.success = false;
        this.number1 = this.getRandomInt(1,10000);
        this.number2 = this.getRandomInt(1,10000);
        this.expectedResult = this.number1 + this.number2;

        if(this.number1 <  this.number2){
          let temp = this.number1;
          this.number1 = this.number2;
          this.number2 = temp;
        }
        this.number1Array = this.getArrayFromInt(this.number1);
        this.number2Array = this.getArrayFromInt(this.number2);
        this.expectedResultArray = this.getArrayFromInt(this.expectedResult);
        this.maxDigit = this.number1Array.length > this.number2Array.length ? this.number1Array.length + 1 : this.number2Array.length + 1;
        for(var i = 0, len = this.maxDigit; i < len; i += 1)
        {
          this.userResultArray[i] = null;
          this.retained[i] = null;
        }
        this.$nextTick(function() {
            this.reinitializeFocus()
        })
      },
      getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        let number = (Math.floor(Math.random() * (max - min)) + min);
        return number
      },
      getArrayFromInt(number){
        let output = [];
        let numberString = number.toString();
        for (var i = 0, len = numberString.length; i < len; i += 1) {
          output.push(+numberString.charAt(i));
        }
        return output
      },
      checkResult(){
        let additionResult = "";
        let noDigit = true;
        let error = false;
        //reset value
        this.error = false;
        this.success = false;
        for (let i = 0, len = this.userResultArray.length; i < len; i += 1) {
          if ((this.userResultArray[i] === null || this.userResultArray[i] === "") && noDigit) {
            continue;
          }
          else if(this.userResultArray[i] === null || this.userResultArray[i] === ""){
            error = true;
            this.vibrate()
            this.reinitializeFocus()

            break;
          }
          else if(!error)
          {
            noDigit = false;
            additionResult += "" + this.userResultArray[i]
          }
        }
        if(error || noDigit){
          this.error= true;
          this.vibrate()
          this.reinitializeFocus()
        }
        else{
          if(parseInt(additionResult) === this.expectedResult){
            this.success= true;
            this.updateResult()
          }
          else{
            this.error= true;
            this.reinitializeFocus()
            this.vibrate();
          }
        }
      },
      addRetained(index) {
        let newRetainedValue;
        newRetainedValue = this.retained[index] == null ? 1 : this.retained[index] == 9 ? null : this.retained[index] + 1;
        this.$set(this.retained, index, newRetainedValue)
      },
      limitToOneDigit(event, index) {
        switch (event.key) {
          case "ArrowDown":
            break
          case "ArrowUp":
            break
          case "ArrowRight":
            if(event.target.nextElementSibling != null)event.target.nextElementSibling.focus();
            break;
          case "ArrowLeft":
            if(event.target.previousElementSibling != null)event.target.previousElementSibling.focus();
            break;
          default:
            if (!isNaN(event.key)) {
              event.preventDefault();
              this.$set(this.userResultArray, index, event.key)
              if(event.target.previousElementSibling != null)event.target.previousElementSibling.focus();
            }
            else if(event.key != "Enter"){
              event.preventDefault()
            }
            break;
        }
      },
      updateResult(){
        this.$emit('updateScore')
      },
      nextCalcul(){
        this.initializeData();
      },
      vibrate(){
        // window.navigator.vibrate([100,30,100,30,100,30,200,30,200,30,200,30,100,30,100,30,100]); // Vibrate 'SOS' in Morse.

        this.bzzz = true
        setTimeout(
          () => {
            this.bzzz = false
          }, 1000);
        window.navigator.vibrate(200);
      },
      reinitializeFocus(){
        //set focus
        let index = parseInt(this.maxDigit) - 1;
        let input = this.$refs.digit[index];
        input.focus();
      }
    }
  }
</script>

<style scoped>

    .module_container{
        display: inline-block;
    }

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

    .module_container{
        display: inline-block;
    }

    .row, .result{
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        margin: 0px;
    }

    .last.row::before{
        content: "+";
        line-height: 16vw;
        font-size: 10vw;
        color: #a5a3a3;
    }

    .figure{
        position: relative;
        display: block;
        width:16vw;
        height:16vw;
        text-align: center;
        vertical-align:middle;
        border: #eee solid;
        border-radius: 5px;
        margin:2px;
        z-index: 1000;
    }

    .figure p{
        width:100%;
        height:100%;
        line-height: 14vw;
        font-size: xx-large;
    }

    input.figure{
        position: relative;
        display: block;
        width:16vw;
        height:16vw;
        text-align: center;
        vertical-align:middle;
        border: #eee solid;
        border-radius: 5px;
        margin:2px;
        z-index: 1000;
        /*line-height: 10vw;*/
        font-size: xx-large;
        top:0px;
        right: 0px;
        cursor: pointer;
    }

    .separator{
        display: inline-block;
        width: 100%;
        height: 5px;
        border: 5px #a5a3a3 solid;
        border-radius: 5px;
        /*border-radius: 15px;*/
        /*position: absolute;*/
        bottom: -1vw;
        content: '';
        z-index: 1000;
        text-align: center;
        font: 0.8vw Arial, sans-serif;
    }

    .calcul{
        display: inline-block;
        position: relative;
        width: 100%;
    }

    .loggin {
        display: inline-block;
        position: relative;
        margin:auto;
    }

    .retained{
        position: absolute;
        top:-10px;
        right:3px;
        width: 15px;
        height: 15px;
        border-width: 2px;
        border-radius: 15px;
        border-style: solid;
        border-color: #eee;
        background-color: white;
        z-index: 1000;
        line-height: 12px;
        font-size: smaller;
        font-size: 12px;
    }

    .figure.error{
        border: red solid 3px;
    }

    .figure.success{
        border: green solid 3px;
    }

    .button{
        width: 100%;
        margin: 5px 0 5px 0;
    }

    .labelled{
        display: flex;
        /* flex-direction: column;*/
        align-items:stretch;
        justify-content: center;
        min-height: 100%;
    }

    .labelled .label{
        /*height: 100%;*/
        border-bottom-right-radius: 0px;
        border-top-right-radius: 0px;
        margin-right: 0px;
        flex-grow: 1;
        vertical-align: middle;
        display: flex;
        align-items:center;
    }

    .labelled input{
        border-bottom-left-radius: 0px;
        border-top-left-radius: 0px;
        flex-grow: 1;

    }

    @media screen and (min-width: 480px) {
        .loggin{
            display: inline-block;
            position: relative;
            width:50vw;
            margin:auto;
        }
        .calcul{
            display: inline-block;
            position: relative;
            width:100%;
        }
        .figure{
            width:8vw;
            height:8vw;
        }
        input.figure{
            width:8vw;
            height:8vw;
        }
        .figure p{
            line-height: 7vw;
        }
    }

    @media screen and (min-width: 480px) {
        .last.row::before {
            content: "+";
            color: #a5a3a3;
            line-height: 8vw;
            font-size: 4vw;
        }
    }

    /*.vibrate{  animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;*/
        /*transform: translate3d(0, 0, 0);}*/

    @-webkit-keyframes shake {
        0%, 100% {
            -webkit-transform: translateX(0) rotate(0deg) translateY(0);
        }
        15%, 35%, 55%, 75%, 95% {
            -webkit-transform: translateX(-1px) rotate(-2deg);
        }
        25%, 45%, 65%, 85% {
            -webkit-transform: translateX(1px) rotate(2deg);
        }
        10%, 30%, 50%, 70%, 90% {
            -webkit-transform: translateY(1px);
        }
        20%, 40%, 60%, 80% {
            -webkit-transform: translateY(-1px);
        }
    }

    @-moz-keyframes shake {
        0%, 100% {
            -moz-transform: translateX(0) rotate(0deg) translateY(0);
        }
        15%, 35%, 55%, 75%, 95% {
            -moz-transform: translateX(-1px) rotate(-2deg);
        }
        25%, 45%, 65%, 85% {
            -moz-transform: translateX(1px) rotate(2deg);
        }
        10%, 30%, 50%, 70%, 90% {
            -moz-transform: translateY(1px);
        }
        20%, 40%, 60%, 80% {
            -moz-transform: translateY(-1px);
        }
    }

    @-o-keyframes shake {
        0%, 100% {
            -o-transform: translateX(0) rotate(0deg) translateY(0);
        }
        15%, 35%, 55%, 75%, 95% {
            -o-transform: translateX(-1px) rotate(-2deg);
        }
        25%, 45%, 65%, 85% {
            -o-transform: translateX(1px) rotate(2deg);
        }
        10%, 30%, 50%, 70%, 90% {
            -o-transform: translateY(1px);
        }
        20%, 40%, 60%, 80% {
            -o-transform: translateY(-1px);
        }
    }

    @keyframes shake {
        0%, 100% {
            transform: translateX(0) rotate(0deg) translateY(0);
        }
        15%, 35%, 55%, 75%, 95% {
            transform: translateX(-1px) rotate(-2deg);
        }
        25%, 45%, 65%, 85% {
            transform: translateX(1px) rotate(2deg);
        }
        10%, 30%, 50%, 70%, 90% {
            transform: translateY(1px);
        }
        20%, 40%, 60%, 80% {
            transform: translateY(-1px);
        }
    }

    .vibrate {
        -webkit-animation-name: shake;
        -moz-animation-name: shake;
        -o-animation-name: shake;
        animation-name: shake;
        -webkit-animation-duration: 2s;
        -moz-animation-duration: 2s;
        -o-animation-duration: 2s;
        animation-duration: 2s;
        -webkit-animation-fill-mode: both;
        -moz-animation-fill-mode: both;
        -o-animation-fill-mode: both;
        animation-fill-mode: both;
        /*-webkit-animation-iteration-count: infinite;*/
        /*-moz-animation-iteration-count: infinite;*/
        /*-o-animation-iteration-count: infinite;*/
        /*animation-iteration-count: infinite;*/
        -webkit-transition-timing-function: cubic-bezier(.36,.07,.19,.97);
    }



</style>
