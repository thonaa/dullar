<template>
  <div class="radiobox-view">
    <div id="container">
      <span>disabled</span>
      <q-radiobox v-model="radiobox1" :disabled="true"></q-radiobox>
      <hr>
      <span>{{ radiobox2 }}</span>
      <q-radiobox v-model="radiobox2"></q-radiobox>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
export default class Radiobox extends Vue {
  public radiobox1 = true;
  public radiobox2 = false;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
</style>
