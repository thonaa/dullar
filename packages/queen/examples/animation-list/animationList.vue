<template>
  <div class="animation-list-view">
    <div id="container">
      <q-button @click="filter">数组反转</q-button>
      <q-animation-list>
        <q-animation-list-item v-for="i in asyncData" :key="i.index">
          <!-- <div style="height: 100px;" :class="[i.index % 2 === 0 ? 'hide' : '']">这是第{{i.index}}个元素</div> -->
          <div style="height: 80px;" v-if="i.index === 5">
            <span @click="dialog">这是第{{i.index}}个元素, 可点击{{showDialog}}</span>
            <q-dialog v-model="showDialog">
              弹窗后页面还能滑动吗
            </q-dialog>
          </div>
          <div style="height: 80px;" v-else>这是第{{i.index}}个元素</div>
        </q-animation-list-item>
      </q-animation-list>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
export default class AnimationList extends Vue {
  public asyncData = [];
  public animation = true;
  public showDialog = false;
  dialog() {
    this.showDialog = true;
  }
  filter() {
    // this.asyncData.reverse();
    this.animation = false;
    const shuffle = this.shuffle(this.asyncData);
    console.log("过滤", shuffle);
    this.asyncData = JSON.parse(JSON.stringify([...shuffle]));
    // this.asyncData = [];
    // this.asyncData = [10, 9, 8];
  }
  getData() {
    console.log("getData");
    const timer = setTimeout(() => {
      const result = [];
      for (let i = 0; i < 20; i++) {
        result.push({ index: i });
      }
      // this.asyncData = [{ index: 1 }, { index: 2 }, { index: 3 }, { index: 4 }];
      this.asyncData = [...result];
      clearTimeout(timer);
    }, 1000);
  }
  shuffle(aArr) {
    let iLength = aArr.length
      , i = iLength
      , nTemp
      , iRandom;
    while ( i-- ) {
      if (i !== (iRandom = Math.floor(Math.random()*iLength))) { // 不是同一个数组项的前提下进行互换
        nTemp = aArr[i];
        aArr[i] = aArr[iRandom];
        aArr[iRandom] = nTemp;
      }
    }
    return aArr;
  }
  mounted() {
    this.getData();
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
  margin: 10px auto;
}
</style>
