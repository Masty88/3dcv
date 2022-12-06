<template>
  <div v-if="game === 'game'">
    <GameScene/>
  </div>
  <div v-else>
    <p>intro</p>
    <button @click = "changeScene" >goTogame</button>
  </div>
</template>

<script>
import GameScene from "@/components/GameScene";
// import IntroScene from "@/components/IntroScene";

import {mapState} from "vuex";
import store from "@/store";

export default {
  name: 'App',
  components: {
    GameScene,
    // IntroScene
  },
  computed: mapState({
    game: state => state.game
  }),
  methods:{
    changeScene(){
      store.commit('changeScene', {
        scene: 'game'
      })
      console.log(store)
    }
  }
}
</script>

<style>

body{
  width: 100%;
  height: 100vh;
  /*max-height: 100vh;*/
  /*overflow-y: hidden;*/
}
*{
  margin: 0;
  padding: 0;
}
</style>
