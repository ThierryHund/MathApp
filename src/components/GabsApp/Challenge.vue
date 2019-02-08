<template>
    <div class="module_container">
        <div v-if="winner" class="winner ui message">
            <h2>You Win !</h2>
            <span>Let's try another challenge</span>
        </div>

        <transition name="fade">
            <div v-if="challengeRules != null && challengesStepsDetails == null" class="challengeDetails ui segment">
                <ul>
                    <li><strong>Name</strong> : {{challengeRules.name}}</li>
                    <li><strong>point</strong>: {{challengeRules.point}}</li>
                    <li v-for="step in challengeRules.steps" :key="step.id" v-html="getDisplayableData(step)"></li>
                </ul>
                <button class="ui primary button" @click="onSelectChallenge(challengeRules)">
                    Try
                </button>
            </div>
        </transition>

        <div class="challengeSlider" v-if="challengesStepsDetails == null">
            <div class="challengeListArrowLeft" :class="{arrowHidden : !sliderArrowIsVisible}"
                 @click="sliderClick('left')"></div>
            <transition-group name="card-animation" tag="div" ref="refChallengeList" class="challengeList">
                <div class="challengeItem" v-for="challengeItem in challengesListJson"
                     :key="challengeItem.id"
                     @click="displayChallenge(challengeItem)">
                    <i class="trophy icon"></i>
                    <span>{{challengeItem.id}}</span>
                    <transition name="fade">
                        <div class="selectedChallenge"
                             v-if="challengeRules != null ? (challengeRules.id == challengeItem.id && challengesStepsDetails == null) : false "></div>
                    </transition>
                </div>
            </transition-group>
            <div class="challengeListArrowRight" :class="{arrowHidden : !sliderArrowIsVisible}"
                 @click="sliderClick('right')"></div>
        </div>


        <div class="ChallengeTitle" v-if="challengesStepsDetails != null">
            <div class="ignored info">
                <i class="trophy icon"></i>
                Challenge : {{challengeRules.name}}
            </div>
        </div>
        <div v-if="challengesStepsDetails != null" class="bar__container">
            <ul class="bar" id="bar">
                <li v-for="(step, index) in challengesStepsDetails"
                    :key="step.id"
                    :class="{active : currentStep == step.id, inactive : currentStep < step.id, completed : currentStep > step.id}"
                    :title="stepMessage(step)"
                    @click="displayTooltip(index)">
                        <div ref="tooltipArrow" class="tooltipArrow"></div>
                        <div ref="tooltip" class="tooltip">{{stepMessage(step)}}</div>
                </li>
            </ul>
        </div>

        <component v-bind:is="currentComponent" v-bind="currentProperties" @nextStep="nextStep"></component>
    </div>
</template>

<script>
  import MY_JSON from './rules/trainingRules.json'
  import Addition from './Addition';
  import Tables from './Tables';

  export default {
    name: 'Challenge',
    data: function () {
      return {
        challengeRules: null,
        currentComponent: null,
        challengesStepsDetails: null,
        currentProperties: null,
        currentStep: null,
        winner: false,
        challengesListJson: null,
        sliderArrowIsVisible: false
      }
    },
    mounted() {
      this.$nextTick(() => {
        window.addEventListener('onorientationchange', this.isOverflown)
        window.addEventListener('resize', this.isOverflown);
      });
      this.initializeData();
    },
    methods: {
      stepMessage(step) {
        switch (step.type) {
          case "additions":
            return step.items.min == step.items.max ? `${step.number} additions with ${step.items.min} numbers` : `${step.number} additions with ${step.items.min} to ${step.items.max} numbers`
          case "tables":
            return !step.randomizedFinal ? `tables ${step.tablesList.join(' ')}` : `tables ${step.tablesList.join(' ')} and one randomized`
          case "soustractions":
            return `${step.number} soustractions with 2 numbers`
        }
      },
      displayTooltip(index) {
        this.$nextTick(function () {
          var step = this.$refs.tooltip[index]
          var stepArrow = this.$refs.tooltipArrow[index]

          if (!step.classList.contains('tooltipActive')) {
            {
              this.$refs.tooltip.forEach(function (step) {
                step.classList.remove('tooltipActive');
              });
              this.$refs.tooltipArrow.forEach(function (stepArrow) {
                stepArrow.classList.remove('tooltipActive');
              });
              step.classList.add('tooltipActive');
              stepArrow.classList.add('tooltipActive');

              setTimeout(() => {
                step.classList.remove('tooltipActive');
                stepArrow.classList.remove('tooltipActive');
              }, 2000)
            }
          }
        })
      },
      isOverflown() {
        if(typeof this.$refs.refChallengeList !== "undefined") this.sliderArrowIsVisible = this.$refs.refChallengeList.$el.offsetWidth < ((this.challengesListJson.length * 60) - 20);
      },
      sliderClick(side) {
        switch (side) {
          case  "left":
            event.target.nextSibling.scrollLeft = event.target.nextSibling.scrollLeft == 0 ? event.target.nextSibling.scrollLeft -= 50 : event.target.nextSibling.scrollLeft -= 60
            break;
          case "right":
            var maxScrollLeft = event.target.previousSibling.scrollWidth - event.target.previousSibling.clientWidth;
            event.target.previousSibling.scrollLeft = event.target.previousSibling.scrollLeft == maxScrollLeft ? event.target.previousSibling.scrollLeft += 50 : event.target.previousSibling.scrollLeft += 60
            break
        }
      },
      initializeData() {
        this.challengesListJson = MY_JSON.rules
        this.isOverflown()
      },
      displayChallenge(challenge) {
        if (this.challengeRules === challenge) {
          this.challengeRules = null
        }
        else {
          this.challengeRules = challenge
        }
      },
      onSelectChallenge() {
        this.challengesStepsDetails = this.challengeRules.steps
        this.launchChallenge()
      },
      launchChallenge() {
        this.currentStep = 1
        this.winner = false
        this.currentProperties = {"stepsDetails": this.challengesStepsDetails[this.currentStep - 1]}
        this.currentComponent = this.challengesStepsDetails[this.currentStep - 1].component
      },
      getDisplayableData(step) {
        switch (step.type) {
          case "additions":
            return step.items.min == step.items.max ? `<strong>additions</strong> : <span>${step.number} additions with ${step.items.min} numbers` : `<strong>additions</strong> : <span>${step.number} additions with ${step.items.min} to ${step.items.max} numbers</span>`
          case "tables":
            return !step.randomizedFinal ? `<strong>Tables</strong> : <span>${step.tablesList.join(' ')}</span>` : `<strong>Tables</strong> : <span>${step.tablesList.join(' ')} and one randomized</span>`
          case "soustractions":
            return `<strong>soustractions</strong> : <span>${step.number} soustractions with 2 numbers</span>`
        }
      },
      nextStep() {
        if (this.challengesStepsDetails.length > this.currentStep) {
          this.currentStep = this.currentStep + 1
          this.currentProperties = {"stepsDetails": this.challengesStepsDetails[this.currentStep - 1]}
          this.currentComponent = this.challengesStepsDetails[this.currentStep - 1].component
        }
        else {
          this.currentStep = null
          this.currentProperties = null
          this.currentComponent = null
          this.challengesStepsDetails = null
          this.winner = true
          this.victory(this.challengeRules.point, this.challengeRules.point)
          this.challengeRules = null
        }
      },
      victory(point, challengeRules) {
        this.$emit('challengeVictory', point, challengeRules)
      },
    },
    components: {
      'tables': Tables,
      'additions': Addition
    }
  }
</script>

<style scoped>

    .tooltipArrow {
        position: absolute;
        visibility: hidden;
        opacity: 0;
        top: 28px;
        left: 10px;
        z-index: 1001;
        width: 0;
        height: 0;
        border-bottom: 15px solid #eee;
        border-left: 15px solid transparent;
        border-right: 0px solid transparent;
        display: block;
        transition: visibility 0.3s linear, opacity 0.3s linear;
        /*-webkit-animation-name: fade;*/
        /*-webkit-animation-duration: 0.5s;*/
        /*-webkit-animation-fill-mode:both;*/
        margin: 0 calc(50% - 20px) 0 calc(50% - 20px);
    }

    .tooltip {
        display: block;
        position: absolute;
        /*display: none;*/
        visibility: hidden;
        z-index: 1001;
        top: 38px;
        opacity: 0;
        background-color: #eee;
        color: black;
        padding: 10px;
        border-radius: 10px;
        transition: visibility 0.3s linear, opacity 0.3s linear;
        margin: 0 auto 0 auto;
        width: 150px;
        left:-20px;
        /*box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);*/
        /*-webkit-animation-name: fade;*/
        /*-webkit-animation-duration: 0.5s;*/
        /*-webkit-animation-fill-mode:both;*/
    }

    .tooltipActive {
        visibility: visible;
        display: block;
        opacity: 1;
    }

    .challengeListArrowLeft {
        position: absolute;
        left: -21px;
        z-index: 1000;
        width: 0;
        height: 0;
        border-right: 21px solid #b5b5b5;
        border-top: 21px solid transparent;
        border-bottom: 21px solid transparent;
        display: inline-block;
    }

    .challengeListArrowRight {
        position: absolute;
        right: -21px;
        z-index: 1000;
        width: 0;
        height: 0;
        border-left: 21px solid #b5b5b5;
        border-top: 21px solid transparent;
        border-bottom: 21px solid transparent;
        display: inline-block;
    }

    .arrowHidden {
        display: none;
    }

    .challengeSlider {
        position: relative;
    }

    .challengeList {
        /*justify-content: center;*/
        position: relative;
        display: inline-flex;
        min-width: 75vw;
        overflow-x: auto;
        max-width: 75vw;
        scroll-behavior: smooth;
    }

    .challengeList::-webkit-scrollbar {
        display: none;
    }

    .module_container {
        width: 100%;
        display: inline-block;
    }

    .challengeItem {
        display: inline-block;
        background-color: #B7D7D8;
        border-radius: 20px;
        width: 40px;
        min-width: 40px;
        height: 40px;
        line-height: 40px;
        margin: 0 10px 20px 10px;
        position: relative;
        box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
        transition: all 0.3s cubic-bezier(.25,.8,.25,1);
    }

    .challengeItem:hover {
        box-shadow: 1px 7px 7px -4px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
    }

    .challengeItem:first-child {
        margin-left: auto;
    }

    .challengeItem:last-child {
        margin-right: auto;
    }

    .challengeDetails {
        position: absolute;
        z-index: 1000;
        /*position:relative;*/
        background-color: #B7D7D8;
        text-align: left;
        left: 10vw;
        right: 10vw;
        margin: 0px;
        padding: 0px;
        top: 169px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
        transition: all 0.3s cubic-bezier(.25,.8,.25,1);
    }

    .challengeDetails > ul {
        padding: 10px;
    }

    .challengeDetails > ul > li {
        list-style: none;
        margin-left: 0;
        padding-left: 0;
    }

    .challengeDetails > button {
        margin: 10px auto 10px auto;
        width: 50%;
        display: block;
    }

    .selectedChallenge {
        z-index: 1000;
        width: 0;
        height: 0;
        border-left: 21px solid transparent;
        border-right: 21px solid transparent;
        border-bottom: 21px solid #B7D7D8;
        position: absolute;
    }

    .ChallengeTitle {
        margin: 0 0 15px 0;
    }

    .steps {
        width: 100%;
    }

    .step {
        font-size: smaller !important;
        padding: 5px !important;
    }

    bar__container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        position: relative;

    }

    .bar {
        display: flex;
        justify-content: center;
        counter-reset: step;
        margin: 0;
        padding: 0;
        position: relative;
    }

    .bar li {
        list-style-type: none;
        /*float: left;*/
        width: 20%;
        position: relative;
        text-align: center;
        font-size: 9px;
        color: #B7D7D8;
        padding-left: 5px;
    }

    @media all and (min-width: 500px) {
        .bar li {
            text-transform: uppercase;
            font-size: 10px;
        }
    }

    .bar li:before {
        content: counter(step);
        counter-increment: step;
        width: 30px;
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        border: 1px solid #B7D7D8;
        display: block;
        text-align: center;
        margin: 0 auto 10px auto;
        border-radius: 50%;
        background-color: #B7D7D8;
        color: #333;
    }

    .bar li:after {
        content: '';
        position: absolute;
        width: 100%;
        height: 2px;
        background: #B7D7D8;
        top: 15px;
        left: -50%;
        z-index: -1;
    }

    .bar li:first-child:after {
        content: none;
    }

    .bar li.active:before {
        background: #27ae60;
        border: 1px solid #89e5b0;
        color: white;
    }

    .bar li.active + li.active:after {
        background: #27ae60;
    }

    .bar li.inactive:before {
        background: #d8d7d7;
        border: 1px solid #b4b3b3;
        color: white;
    }

    .bar li.inactive + li.inactive:after {
        background: rgba(40, 40, 40, .3);
    }

    .bar li.completed:before {
        background: #d8d7d7;
        border: 1px solid #b4b3b3;
        content: '\002713';
        color: #27ae60;
        font-size: x-large;
        font-weight: 800;
    }

    .bar li.completed + li.inactive:after {
        background: rgba(40, 40, 40, .3);
    }

    .bar li.active:first-child + li:after:not(.active) {
        background: white;
    }

    @media only screen and (min-width: 500px) {
        .challengeDetails {
            /*left:60vw;*/
            /*right:60vw;*/
            width: 60vw;
            margin: auto;
        }

        .challengeList {
            /*left:30vw;*/
            /*max-width: 60vw;*/
            /*min-width: 60vw;*/
            max-width: 60vw;
            min-width: 60vw;

        }

        .challengeSlider {
            margin: auto;
            display: inline-block;
            padding: 0 20px 0 20px;
        }

        .tooltip{
            width: 100%;
        }
    }

    @keyframes fade {
        0% {opacity: 0;display: none; }
        1% {opacity: 0;display: block; }
        100% {opacity: 1; display: block;}
    }

    .slide-left {
        -webkit-animation: slide-left 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
        animation: slide-left 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
    }

    /**
     * ----------------------------------------
     * animation slide-left
     * ----------------------------------------
     */
    @-webkit-keyframes slide-left {
        0% {
            -webkit-transform: translateX(0);
            transform: translateX(0);
        }
        100% {
            -webkit-transform: translateX(-100px);
            transform: translateX(-100px);
        }
    }

    @keyframes slide-left {
        0% {
            -webkit-transform: translateX(0);
            transform: translateX(0);
        }
        100% {
            -webkit-transform: translateX(-100px);
            transform: translateX(-100px);
        }
    }

    .card-animation-enter-active, .card-animation-leave-active {
        animation: slide-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
        /*opacity: 0;*/

    }

    .card-animation-enter, .card-animation-leave-to {
        transform: scale(0);
        opacity: 0;
    }

    /*.card-animation-move {*/
    /*transition: transform 1s;*/
    /*opacity: 0;*/
    /*}*/

    .slide-in-right {
        -webkit-animation: slide-in-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
        animation: slide-in-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
    }

    /**
     * ----------------------------------------
     * animation slide-in-right
     * ----------------------------------------
     */
    @-webkit-keyframes slide-in-right {
        0% {
            -webkit-transform: translateX(1000px);
            transform: translateX(1000px);
            opacity: 0;
        }
        100% {
            -webkit-transform: translateX(0);
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slide-in-right {
        0% {
            -webkit-transform: translateX(1000px);
            transform: translateX(1000px);
            opacity: 0;
        }
        100% {
            -webkit-transform: translateX(0);
            transform: translateX(0);
            opacity: 1;
        }
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }

    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
    {
        opacity: 0;
    }

</style>
