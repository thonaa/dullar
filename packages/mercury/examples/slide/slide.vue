<template>
  <div>
    <h2>yn-slide</h2>
    <ul>
      <li>
        <yn-slide :width="60" :trigger="20" class="one" ref="slide">
          <template v-slot:content>一个按钮，尝试左滑呢？</template>
          <template v-slot:buttons>
            <span class="buttons" @click="handleClick('确认', true)">确定</span>
          </template>
        </yn-slide>
      </li>
      <li>
        <yn-slide :width="60" :trigger="20" class="two">
          <template v-slot:content>两个按钮，尝试左滑呢？</template>
          <template v-slot:buttons>
            <span class="buttons" @click="handleClick('确认')">确定</span>
            <span class="buttons" @click="handleClick('删除')">删除</span>
          </template>
        </yn-slide>
      </li>
      <li>
        <yn-slide :width="60" :trigger="20" class="three">
          <template v-slot:content>三个按钮，尝试左滑呢？</template>
          <template v-slot:buttons>
            <span class="buttons" @click="handleClick('确认')">确定</span>
            <span class="buttons" @click="handleClick('删除')">删除</span>
            <span class="buttons" @click="handleClick('编辑')">编辑</span>
          </template>
        </yn-slide>
      </li>
    </ul>
    <h2>group</h2>
    <span @click="handleDelete">通过数据删除</span>/
    <span @click="handleDeleteDOM">通过DOM删除</span>
    <ul class="dom">
      <li v-for="(item, key) in list" :key="key">
        <yn-slide groupName="xxx" :uid="item.id" :width="60" :trigger="20" class="four">
          <template v-slot:content>{{ item.id }}一个按钮，尝试左滑呢？</template>
          <template v-slot:buttons>
            <span class="buttons" @click="handleClick('确认', true)">确定</span>
          </template>
        </yn-slide>
      </li>
    </ul>
  </div>
</template>
<script type="text/javascript">
export default {
  name: "YnSlidePage",
  data() {
    return {
      list: [
        { id: "aaaaa" },
        { id: "bbbbb" },
        { id: "ccccc" },
        { id: "ddddd" },
        { id: "eeeee" },
        { id: "fffff" },
        { id: "ggggg" },
        { id: "hhhhh" },
        { id: "iiiii" },
        { id: "jjjjj" },
        { id: "kkkkk" },
      ]
    };
  },
  methods: {
    handleDeleteDOM() {
      const ul = document.querySelector("ul.dom");
      const lis = ul.getElementsByTagName("li");
      lis[0].parentNode.firstChild.remove();
    },
    handleDelete() {
      this.list.pop();
    },
    handleClick(msg, reset = false) {
      this.Toast(msg);
      if (reset) {
        this.$refs.slide.reset();
      }
    }
  }
};
</script>
<style type="text/css" scoped="scoped">
  ul {
    padding: 0;
    margin: 0;
  }
  li {
    text-align: center;
    list-style: none;
    height: 40px;
    line-height: 40px;
    color: #ccc;
    background: #ccc;
    margin: 20px auto;
  }
  ul.dom li {
    margin: 1px auto;
  }
  .one {
    background: red;
  }
  .two {
    background: yellow;
  }
  .three {
    background: green;
  }
  .four {
    background: purple;
  }
  .buttons {
    background: #eee;
    color: #fff;
    display: inline-block;
    width: 100%;
  }
</style>
