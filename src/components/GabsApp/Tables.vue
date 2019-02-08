<template>
    <div class="module_container">
        <div v-bind:class="{displayed : isNumberSelectorDisplay}" @click="isNumberSelectorDisplay = false" class="slide-in-fwd-center numberSelector">
            <span>Select a table</span>
            <div  class="tableItem" v-for="figure in [2,3,4,5,6,7,8,9,10]" :key="figure" @click="initializeData(figure), isNumberSelectorDisplay = false">
                {{figure}}
            </div>
        </div>
        <div class="calcul">
            <div v-if="typeof stepsDetails === 'undefined'" class="selector">
                <button @click="initializeData(0)" class="ui primary button">Random table</button>
                <button @click="tableSelector()" class="ui positive button">Table selector</button>
            </div>

            <form v-on:submit.prevent="">
                <div class="row" v-bind:class="{ emoji: calcul.success}" v-for="(calcul, index) in table" :key="calcul.id">
                    <div class="figure"
                         v-bind:class="{ vibrate: calcul.bzzz}">
                        <p>{{calcul.nb1}}</p>
                    </div>
                    <span class="symbol">X</span>
                    <div class="figure"
                         v-bind:class="{ vibrate: calcul.bzzz}">
                        <p>{{calcul.nb2}}</p>
                    </div>
                    <span class="symbol">=</span>
                    <div class="result">
                        <input class="figure"
                               ref="input_result"
                               v-bind:class="{ success: calcul.success, error: calcul.error, vibrate : calcul.bzzz }"
                               :disabled="calcul.disabled"
                               type="number"
                               pattern="[0-100]"
                               min="0"
                               max="100"
                               v-model="table[index].userResult"
                               @keydown="limitDigit($event, calcul)"
                               @input="triggerCheckResult($event, calcul)"
                        >
                        <img v-bind:class="{ succesIcon: calcul.success}" class="bounce-in-fwd userIcon" :src="require('../../asset/little-goku-blue.png')" />

                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'Tables',
    props: {
      stepsDetails: null,
    },
    data: function () {
      return {
        challengeTableList: null,
        tableSelected: 0,
        nb1: 0,
        nb2: 0,
        table: [],
        success: false,
        error: false,
        userResult: null,
        expectedResult: null,
        bzzz: false,
        isNumberSelectorDisplay: false,
      }
    },
    watch: {
      stepsDetails: function () {
        this.initializeData()
      },
    },
    created() {
      if (typeof this.stepsDetails !== 'undefined')this.initializeData();
    },
    methods: {
      tableSelector() {
        this.isNumberSelectorDisplay = true;
      },
      initializeData(nbTable = 0) {
        this.error = false;
        this.success = false;
        this.userResult = null
        //tables selection before first step
        if (typeof this.stepsDetails !== 'undefined') {
          if(this.challengeTableList === null || this.challengeTableList.length === 0){
            this.challengeTableList = [...this.stepsDetails.tablesList]
            if(this.stepsDetails.randomizedFinal){
              this.challengeTableList.push("*")
            }
          }
          nbTable = this.challengeTableList.shift()
        }
        else{
          nbTable = nbTable == 0 ? this.getRandomIntInclusive(2, 9) : nbTable
        }

        this.table = []

        for (var i = 1; i <= 10; i += 1) {
          if(nbTable == "*")
          {
            let temp2
            if(typeof this.stepsDetails !== 'undefined')
            {
              temp2 = this.stepsDetails.tablesList[Math.floor(Math.random()*this.stepsDetails.tablesList.length)];
            }
            else{
              temp2 = this.getRandomIntInclusive(2, 9)
            }
            let temp1 = this.getRandomIntInclusive(2, 9);
            this.table.push({
              id: i,
              nb1: temp1,
              nb2: temp2,
              result: temp1 * temp2,
              userResult: "",
              success: false,
              error: false,
              bzzz: false,
              disabled:true
            });
          }
          else
          {
            this.table.push({
              id: i,
              nb1: i,
              nb2: nbTable,
              result: i * nbTable,
              userResult: "",
              success: false,
              error: false,
              bzzz: false,
              disabled:true
            });
          }
        }
        this.setFocus(0);
      },
      getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
      },
      checkResult(calcul) {
        if (parseInt(calcul.userResult) === calcul.result) {
          //TODO success by row
          calcul.success = true;
          if(calcul.id == 10 )
          {
            let scrollOptions = {
                left: 0,
                top: 0,
                behavior: 'smooth'
            }
            window.scrollTo(scrollOptions)
            //if no challenge update score after each table
            if(typeof this.stepsDetails === 'undefined')
            {
                this.updateResult(5)
            }
            else if(typeof this.stepsDetails !== 'undefined' && this.challengeTableList.length === 0){
              this.nextChallengeStep()
            }
            else if(this.challengeTableList.length !== 0){
              setTimeout(()=>{this.initializeData()},2000)
            }
          }
          else this.setFocus(calcul.id)
        }
        else {
          calcul.error = true;
          this.vibrate(calcul);
        }
      },
      updateResult(point) {
        this.$emit('updateScore', point)
      },
      nextChallengeStep()
      {
        this.$emit('nextStep')
      },
      vibrate(calcul) {
        calcul.bzzz = true
        setTimeout(
          () => {
            calcul.bzzz = false
          }, 1000);
        window.navigator.vibrate(200);
      },
      limitDigit(event, calcul) {
        switch (event.key) {
          case "ArrowDown":
            break
          case "ArrowUp":
            break
          case "ArrowRight":
            break;
          case "ArrowLeft":
            break;
          case "Enter":
            break;
          case "Backspace":
            break;
          default:
            if (!isNaN(event.key)) {
              if (calcul.userResult !== null && calcul.userResult.length == calcul.result.toString().length) {
                (event.preventDefault(), calcul.userResult = event.key)
              }
            }
            else {
              event.preventDefault()
            }
            break;
        }
      },
      triggerCheckResult(event, calcul) {
        //we also check calcul.success to avoid multi check result trigerred by keyup event
        if (calcul.userResult !== null && calcul.userResult.toString().length == calcul.result.toString().length && !calcul.success) {
              this.checkResult(calcul);
              setTimeout(
                () => {
                  if (!calcul.success) {
                    calcul.userResult = null;
                    calcul.error = false;
                    calcul.error = false;
                  }
                }, 500);
        }
      },
      setFocus(index) {
        this.$nextTick(function () {
          //TODO do a check if exist this.$refs
          //TODO and manage post victory
          if (index <= this.$refs.input_result.length - 1) {
            if(index !== 0 )this.table[index - 1].disabled = true
            this.table[index].disabled = false
            this.$nextTick(function () {
                let input = this.$refs.input_result[index];
                input.focus();
            })
          }
        })

      }
    }
  }
</script>

<style scoped>

    .selector{
        margin: 10px;
    }

    .numberSelector{
        z-index: 2000;
        display: none;
        flex-direction: column;
        justify-content: space-between;
        position: absolute;
        top:0;
        left:0;
        width:100%;
        background-color: darkcyan;
        /*height: 100%;*/
        overflow: visible;
    }

    .numberSelector > span{
        color:aquamarine;
        margin:0 0 5px 0
    }

    .numberSelector.displayed{
        display: flex;
    }

    .tableItem{
        width: 20vw;
        height: 20vw;
        line-height: 20vw;
        border: 2px solid aquamarine;
        border-radius: 10vw;
        margin:3vw auto 3vw auto;
        font-size: 10vw;
        color:aquamarine
    }

    .result{
        position: relative;
    }

    .userIcon{
        display:none
    }

    .succesIcon{
        position: absolute;
        top: 5px;
        right: -37px;
        vertical-align: middle;
        height: 80%;
        display:inline-block;
        border-radius: 20px;
        margin:auto
    }

    .module_container{
        display: inline-block;
    }
    .row {
        position: relative;
        flex-direction: row;
        justify-content: center;
        margin: 0px;
        vertical-align: middle;
        align-items: center;
    }

    .figure {
        position: relative;
        display: block;
        width: 16vw;
        height: 16vw;
        text-align: center;
        vertical-align: middle;
        border-radius: 5px;
        border: #d69c9c solid 2px;
        margin: 2px;
        z-index: 1000;
    }

    .figure p {
        width: 100%;
        height: 100%;
        line-height: 14vw;
        font-size: xx-large;
        background-color: #eae2de;
    }

    input.figure {
        border: #d69c9c solid 2px;
        position: relative;
        display: block;
        width: 16vw;
        height: 16vw;
        text-align: center;
        vertical-align: middle;
        border-radius: 5px;
        margin: 2px;
        z-index: 1000;
        font-size: xx-large;
        top: 0px;
        right: 0px;
        cursor: pointer;
    }

    .result input.figure{
        width: 20vw;
    }

    .figure.error {
        border: red solid 3px;
    }

    .figure.success {
        border: green solid 3px;
    }

    /************************************/
    /********   No Mobile   *************/
    /************************************/

    @media screen and (min-width: 480px) {

        .succesIcon{
            top: 5px;
            right: -5vw;        }

        .calcul {
            display: inline-block;
            position: relative;
            width: 100%;
        }

        .figure {
            width: 8vw;
            height: 8vw;
        }

        input.figure {
            width: 8vw;
            height: 8vw;
        }

        .result input.figure {
            width: 10vw;
        }

        .figure p {
            line-height: 7vw;
        }
    }

    /************************************/
    /******  Animation class  ***********/
    /************************************/

    .slide-in-fwd-center {
        -webkit-animation: slide-in-fwd-center 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
        animation: slide-in-fwd-center 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
    }

    @-webkit-keyframes slide-in-fwd-center {
        0% {
            -webkit-transform: translateZ(-1400px);
            transform: translateZ(-1400px);
            opacity: 0;
        }
        100% {
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
            opacity: 1;
        }
    }
    @keyframes slide-in-fwd-center {
        0% {
            -webkit-transform: translateZ(-1400px);
            transform: translateZ(-1400px);
            opacity: 0;
        }
        100% {
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
            opacity: 1;
        }
    }

    .slide-in-bck-center {
        -webkit-animation: slide-in-bck-center 0.7s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
        animation: slide-in-bck-center 0.7s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
    }


    @-webkit-keyframes slide-in-bck-center {
        0% {
            -webkit-transform: translateZ(600px);
            transform: translateZ(600px);
            opacity: 0;
        }
        100% {
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
            opacity: 1;
        }
    }
    @keyframes slide-in-bck-center {
        0% {
            -webkit-transform: translateZ(600px);
            transform: translateZ(600px);
            opacity: 0;
        }
        100% {
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
            opacity: 1;
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
        -webkit-transition-timing-function: cubic-bezier(.36, .07, .19, .97);
    }

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

    @-webkit-keyframes bounce-in-fwd {
        0% {
            -webkit-transform: scale(0);
            transform: scale(0);
            -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
            opacity: 0;
        }
        38% {
            -webkit-transform: scale(1);
            transform: scale(1);
            -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
            opacity: 1;
        }
        55% {
            -webkit-transform: scale(0.7);
            transform: scale(0.7);
            -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
        }
        72% {
            -webkit-transform: scale(1);
            transform: scale(1);
            -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
        }
        81% {
            -webkit-transform: scale(0.84);
            transform: scale(0.84);
            -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
        }
        89% {
            -webkit-transform: scale(1);
            transform: scale(1);
            -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
        }
        95% {
            -webkit-transform: scale(0.95);
            transform: scale(0.95);
            -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
        }
        100% {
            -webkit-transform: scale(1);
            transform: scale(1);
            -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
        }
    }

    .bounce-in-fwd {
        -webkit-animation: bounce-in-fwd 1.1s both;
        animation: bounce-in-fwd 1.1s both;
    }

    @keyframes bounce-in-fwd {
        0% {
            -webkit-transform: scale(0);
            transform: scale(0);
            -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
            opacity: 0;
        }
        38% {
            -webkit-transform: scale(1);
            transform: scale(1);
            -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
            opacity: 1;
        }
        55% {
            -webkit-transform: scale(0.7);
            transform: scale(0.7);
            -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
        }
        72% {
            -webkit-transform: scale(1);
            transform: scale(1);
            -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
        }
        81% {
            -webkit-transform: scale(0.84);
            transform: scale(0.84);
            -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
        }
        89% {
            -webkit-transform: scale(1);
            transform: scale(1);
            -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
        }
        95% {
            -webkit-transform: scale(0.95);
            transform: scale(0.95);
            -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
        }
        100% {
            -webkit-transform: scale(1);
            transform: scale(1);
            -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
        }
    }
</style>
