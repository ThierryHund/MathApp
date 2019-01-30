<template>
    <div class="module_container">
        <div class="calcul">

            <div class="row" v-for="(number, i) in numbers" :key="i">
                <span v-if="i == numbers.length -  1" class="mathSign">{{type == 1 ? "+" : "-"}}</span>
                <div class="figure" v-for="(nb1, j) in number[1]"
                     :key="j"
                     v-bind:class="{ vibrate : bzzz }">
                        <p>{{nb1}}</p>
                        <div v-if="(j !=  numbers[0][1].length - 1) && type == 1 && i == 0 && j != numbers[0][1].length -  1"
                             class="retained"
                             @click="addRetained(j)">{{retained[j]}}</div>
                        <div v-if="type == 2 && j != 0  && i == 0"
                             class="retainedSousMain"
                             @click="addRetained(j)">{{retained[j]}}</div>
                        <div v-if="(j !=  numbers[0][1].length - 1) && type == 2 &&  i != 0 && j !=  numbers[0][1].length - 1 " class="retainedSousSub">{{retained[j + 1]}}</div>

                </div>
            </div>

            <div class="separator"></div>
            <form v-on:submit.prevent="">
                <div class="result">
                    <input ref="digit" class="figure"
                           v-bind:class="{ success: success, error: error, vibrate : bzzz }"
                           :disabled="success"
                           v-for="(digit, index) in maxDigit"
                           :key="index" type="number"
                           pattern="[0-9]"
                           v-model="userResultArray[index]"
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
  var type = {
    ADDITION: 1,
    SOUSTRACTION: 2,
  };

  export default{
    name: 'Addition',
    data: function(){
      return {
        type:null,
        isLoggedIn: false,
        numbers:[],

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
    methods: {
      initializeData(){
        //select type of calcul
        this.type = this.getRandomInt(1,3) == 1 ? type.ADDITION : type.SOUSTRACTION

        //initialize variable
        this.error = false;
        this.success = false;
        this.numbers = [];

        //create custom numbers array
        let numbersInCalcul = this.type == type.ADDITION ? this.getRandomInt(2,5) : 2
        for(i = 1; i <= numbersInCalcul; i++)
        {
          let temp = this.getRandomInt(1,10000)
          this.numbers.push([ temp, this.getArrayFromInt(temp)])
        }
        this.numbers.sort((x,y)=>{ return y[0] - x[0]})

        //calcul sum or sum
        switch (this.type) {
          case type.ADDITION:
            this.expectedResult = this.numbers.reduce((a, b) => a + b[0], 0)
            break;
          case type.SOUSTRACTION:
            this.numbers.forEach((value, index) => {this.expectedResult = index === 0 ? this.expectedResult = value[0] : this.expectedResult - value[0]}, this)
            break
        }

        //make all array same lemght (for use in template)
        this.numbers.forEach((value, index) =>{
          if(index != 0){
              while(value[1].length != this.numbers[0][1].length)
              {
                value[1].splice(0, 0, "");
              }
          }
        })

        //calculate  resultArray nd retainedArray
        this.expectedResultArray = this.getArrayFromInt(this.expectedResult);
        this.maxDigit = this.numbers[0][1].length + 1;
        for(var i = 0, len = this.maxDigit; i < len; i += 1)
        {
          this.userResultArray[i] = null;
          this.retained[i] = null;
        }

        //focus on first digit to fill
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
            this.updateResult(1)
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
      updateResult(point){
        this.$emit('updateScore', point)
      },
      nextCalcul(){
        this.initializeData();
      },
      vibrate(){
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

    .module_container{
        display: inline-block;
    }

    .row, .result{
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        margin: 0px;
    }

    .mathSign{
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
        border: #d69c9c solid 2px;
        border-radius: 5px;
        margin:2px;
        z-index: 1000;
    }

    .figure p{
        width:100%;
        height:100%;
        line-height: 14vw;
        font-size: xx-large;
        background-color: #eae2de;
    }

    input.figure{
        position: relative;
        border:solid 2px #d69c9c;
        display: block;
        width:16vw;
        height:16vw;
        text-align: center;
        vertical-align:middle;
        border-radius: 5px;
        margin:2px;
        z-index: 1000;
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

    .retained{
        position: absolute;
        top:-10px;
        right:3px;
        width: 15px;
        height: 15px;
        border-radius: 15px;
        border:solid 2px #d69c9c;
        background-color: white;
        z-index: 1000;
        line-height: 12px;
        font-size: 12px;
        cursor:pointer;
        color: #ff946d;
    }

    .retainedSousMain{
        position: absolute;
        top:9.5vw;
        right:9.5vw;
        width: 15px;
        height: 15px;
        border-radius: 15px;
        border-style: solid;
        background-color: white;
        z-index: 1000;
        line-height: 12px;
        font-size: 12px;
        cursor:pointer;
        color: #ff946d;
        border:solid 2px #d69c9c
    }

    .retainedSousSub
    {
        position: absolute;
        top:9.5vw;
        right:9.5vw;
        width: 15px;
        height: 15px;
        border-width: 1px;
        border-radius: 15px;
        border:solid 2px #d69c9c;
        background-color: white;
        z-index: 1000;
        line-height: 12px;
        font-size: smaller;
        font-size: 12px;
        cursor:pointer;
        color: #ff946d;
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

    /************************************/
    /********   No Mobile   *************/
    /************************************/

    @media screen and (min-width: 480px) {
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

        .retainedSousMain{
            top:5vw;
            right:5vw;
        }

        .retainedSousSub
        {
            top:5vw;
            right:5vw;
        }

        .mathSign{
            color: #a5a3a3;
            line-height: 8vw;
            font-size: 4vw;
        }
    }


    /************************************/
    /******  Animation class  ***********/
    /************************************/

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
        -webkit-transition-timing-function: cubic-bezier(.36,.07,.19,.97);
    }
</style>
