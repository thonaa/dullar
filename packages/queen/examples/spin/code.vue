<template>
  <div class="code">
    <h3>html</h3>
    <pre><code class="lang-html">{{ exampleCode }}</code></pre>
  </div>
</template>
<script lang="ts">
  import { Options, Vue } from 'vue-class-component';
  const exampleCode =
  `
  // The default type is snake
  <q-spin
    type="snake"
  >
  </q-spin>

  <q-spin
    type="rotate"
    size="40"
  >
  </q-spin>

  <q-spin
    type="triple-bounce"
    size="40"
  >
  </q-spin>
  `;
  @Options({
    name: "SpinCode"
  })
  export default class SpinCode extends Vue {
    public exampleCode = exampleCode;
    mounted() {
      document.querySelectorAll("pre code").forEach(block => window.Prism.highlightElement(block));
    }
  }
</script>