<template>
  <div class="icon-view">
    <div id="container">
      <ul>
        <li>我是组件库自带的<q-icon name="close" @click="handleClick"></q-icon></li>
        <li>我是扩展来的<q-icon name="location" @click="handleClick"></q-icon></li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
// import Queen from "../../src/component/Queen";
export default class Toast extends Vue {
  handleClick() {
    this.Toast("点击了");
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style: none;
}
ul li{
  margin: 20px auto;
}
</style>
