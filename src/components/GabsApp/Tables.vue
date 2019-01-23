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
            <div class="ui labelled input">
                <div class="ui label">
                    <span>Table number </span>
                </div>
                <input required class="table_select"
                       type="tel"
                       @keydown="limit1Digit($event)"
                       placeholder="Choose a table"
                       v-model="tableSelected"
                       pattern="[2-9*]"
                       min="2"
                       max="9"/>
                <button @click="initializeData()" class="ui primary button">Ok</button>
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
                               :disabled="calcul.success"
                               type="number"
                               pattern="[0-100]"
                               min="0"
                               max="100"
                               v-model="table[index].userResult"
                               @keydown="limitDigit($event, calcul)"
                               @keyup="triggerCheckResult($event, calcul)">
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'Tables',
    data: function () {
      return {
        tableSelected: 0,
        nb1: 0,
        nb2: 0,
        table: [],
        success: false,
        error: false,
        userResult: null,
        expectedResult: null,
        // digitNumber: null,
        bzzz: false
      }
    },
    created() {
      this.initializeData();
    },
    directives: {
      focus: {
        update: function (el) {
          el.focus()
        },
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
      initializeData() {
        this.error = false;
        this.success = false;
        this.userResult = null
        this.table = []
        let nbTable = this.tableSelected == 0 ? this.getRandomIntInclusive(2, 9) : this.tableSelected

        for (var i = 1; i <= 10; i += 1) {
          if(nbTable == "*")
          {
            let temp1 = this.getRandomIntInclusive(2, 9);
            let temp2 = this.getRandomIntInclusive(2, 9)
            this.table.push({
              id: i,
              nb1: temp1,
              nb2: temp2,
              result: temp1 * temp2,
              userResult: "",
              success: false,
              error: false,
              bzzz: false
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
              bzzz: false
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
          this.updateResult()
          this.setFocus(calcul.id)
        }
        else {
          calcul.error = true;
          this.vibrate(calcul);
        }
      },
      updateResult() {
        this.$emit('updateScore')
      },
      vibrate(calcul) {
        // window.navigator.vibrate([100,30,100,30,100,30,200,30,200,30,200,30,100,30,100,30,100]); // Vibrate 'SOS' in Morse.
        calcul.bzzz = true
        setTimeout(
          () => {
            calcul.bzzz = false
          }, 1000);
        window.navigator.vibrate(200);
      },
      nextCalcul() {
        this.initializeData();
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
              if (calcul.userResult !== null && calcul.userResult.length == 3) {
                (event.preventDefault(), calcul.userResult = event.key)
              }
            }
            else {
              event.preventDefault()
            }
            break;
        }
      },
      //TODO refactor this stuff
      limit1Digit(event) {
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
            if (!isNaN(event.key) || event.key == "*") {
              event.preventDefault();
              this.tableSelected = event.key
            }
            else {
              event.preventDefault()
            }
            break;
        }
      },
      triggerCheckResult(event, calcul) {
        if (calcul.userResult.toString().length == calcul.result.toString().length) {
          setTimeout(
            () => {
              this.checkResult(calcul);
              setTimeout(
                () => {
                  if (!calcul.success) {
                    calcul.userResult = null;
                    calcul.error = false;
                    calcul.error = false;
                  }
                }, 1000);
            }, 1000);
        }
      },
      setFocus(index) {
        //set focus
        this.$nextTick(function () {
          //TODO do a check if exist this.$refs
          //TODO and manage post victory
          if (index <= this.$refs.input_result.length - 1) {
            let input = this.$refs.input_result[index];
            input.focus();
          }
        })

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

    .row {
        display: flex;
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
        border: #eee solid;
        border-radius: 5px;
        margin: 2px;
        z-index: 1000;
    }

    .figure p {
        width: 100%;
        height: 100%;
        line-height: 14vw;
        font-size: xx-large;
    }

    input.figure {
        position: relative;
        display: block;
        width: 16vw;
        height: 16vw;
        text-align: center;
        vertical-align: middle;
        border: #eee solid;
        border-radius: 5px;
        margin: 2px;
        z-index: 1000;
        line-height: 10vw;
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

    .button {
        width: 10vw;
        margin: 0px 5px 0px 5px;
        padding: 0 0 0 0;
    }

    .labelled {
        margin: 10px;
        display: flex;
        /* flex-direction: column;*/
        align-items: stretch;
        justify-content: center;
        min-height: 100%;
    }

    .labelled input {
        border-bottom-left-radius: 0px;
        border-top-left-radius: 0px;
        flex-grow: 0;
        width: 15vw;

    }

    .labelled .label {
        /*height: 100%;*/
        border-bottom-right-radius: 0px;
        border-top-right-radius: 0px;
        margin-right: 0px;
        flex-grow: 0;
        vertical-align: middle;
        display: flex;
        align-items: center;
    }

    /*.row.emoji::after{*/
    /*content:"🤩";*/
    /*width: 8vw;*/
    /*height:8vw;*/
    /*border-radius: 5px;*/
    /*}*/

    @media screen and (min-width: 480px) {
        .loggin {
            display: inline-block;
            position: relative;
            width: 50vw;
            margin: auto;
        }

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
        -webkit-transition-timing-function: cubic-bezier(.36, .07, .19, .97);
    }


</style>
