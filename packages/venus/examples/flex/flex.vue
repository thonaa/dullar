<template>
  <div class="flex-view">
    <div id="container">
      <a href="https://wow.techbrood.com/fiddle/8177" target="_blank">查看原案例</a>
      <v-flex justifyContent="center" alignItems="center" class="face">
        <transition>
          <!-- 加一层<transition>也是可以的，其他元素就不行了哦，暂时不支持<transition-group> -->
          <v-flex-item class="dot"></v-flex-item>
        </transition>
      </v-flex>
      <v-flex justifyContent="spaceBetween" class="face">
        <v-flex-item class="dot"></v-flex-item>
        <v-flex-item class="dot" align-self="flex-end"></v-flex-item>
      </v-flex>
      <v-flex justifyContent="spaceBetween" class="face">
        <v-flex-item class="dot"></v-flex-item>
        <v-flex-item class="dot" align-self="center"></v-flex-item>
        <v-flex-item class="dot" align-self="flex-end"></v-flex-item>
      </v-flex>
      <v-flex justifyContent="spaceBetween" flexDirection="column" class="face">
        <v-flex-item>
          <v-flex justifyContent="spaceBetween">
            <v-flex-item class="dot"></v-flex-item>
            <v-flex-item class="dot"></v-flex-item>
          </v-flex>
        </v-flex-item>
        <v-flex-item>
          <v-flex justifyContent="spaceBetween">
            <v-flex-item class="dot"></v-flex-item>
            <v-flex-item class="dot"></v-flex-item>
          </v-flex>
        </v-flex-item>
      </v-flex>
      <v-flex justifyContent="spaceBetween" flexDirection="column" class="face">
        <v-flex-item>
          <v-flex justifyContent="spaceBetween">
            <v-flex-item class="dot"></v-flex-item>
            <v-flex-item class="dot"></v-flex-item>
          </v-flex>
        </v-flex-item>
        <v-flex-item>
          <v-flex justify-content="center">
            <v-flex-item class="dot"></v-flex-item>
          </v-flex>
        </v-flex-item>
        <v-flex-item>
          <v-flex justifyContent="spaceBetween">
            <v-flex-item class="dot"></v-flex-item>
            <v-flex-item class="dot"></v-flex-item>
          </v-flex>
        </v-flex-item>
      </v-flex>
      <v-flex justifyContent="spaceBetween" flexDirection="column" class="face">
        <v-flex-item>
          <v-flex justifyContent="spaceBetween">
            <v-flex-item class="dot"></v-flex-item>
            <v-flex-item class="dot"></v-flex-item>
          </v-flex>
        </v-flex-item>
        <v-flex-item>
          <v-flex justify-content="spaceBetween">
            <v-flex-item class="dot"></v-flex-item>
            <v-flex-item class="dot"></v-flex-item>
          </v-flex>
        </v-flex-item>
        <v-flex-item>
          <v-flex justifyContent="spaceBetween">
            <v-flex-item class="dot"></v-flex-item>
            <v-flex-item class="dot"></v-flex-item>
          </v-flex>
        </v-flex-item>
      </v-flex>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
export default class Flex extends Vue {
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.face {
  margin: 16px;
  padding: 4px;
  background-color: #e7e7e7;
  width: 104px;
  height: 104px;
  -o-object-fit: contain;
  object-fit: contain;
  box-shadow: inset 0 5px white, inset 0 -5px #bbb, inset 5px 0 #d7d7d7,
    inset -5px 0 #d7d7d7;
  border-radius: 10%;
}
.dot {
  display: block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin: 4px;
  background-color: #333;
  box-shadow: inset 0 3px #111, inset 0 -3px #555;
}
</style>
