<template>
  <div class="staticPage">
    <div class="container contact-page">
      <h1>Help Center</h1>
      <p>Some text</p>
      <ul v-if="items && items.length">
        <NodeTree v-for="node in items" :node="node" :key="node.id" />
      </ul>
    </div>
  </div>
</template>

<script>
import NodeTree from "./NodeTree";

export default {
  components: {
    NodeTree
  },
  computed: {
    items() {
      return this.$store.state.support.items;
    }
  },
  mounted() {
    this.$store.dispatch("support/fetch");
  }
};
</script>
