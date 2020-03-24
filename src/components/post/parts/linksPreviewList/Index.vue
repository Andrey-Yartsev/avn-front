<template>
  <div class="clipLinks" v-if="getClipStoreLinks.length">
    <Item v-for="link in getClipStoreLinks" :key="link" :linkUrl="link" />
  </div>
</template>

<script>
import Item from "./Item";

export default {
  name: "LinksPreviewList",
  props: {
    text: {
      type: String
    }
  },
  components: {
    Item
  },
  computed: {
    getClipStoreLinks() {
      const links = this.selectAllLinksFromText();
      return Array.isArray(links) ? links : [];
    }
  },
  methods: {
    selectAllLinksFromText() {
      let links = [];
      const text = this.$props.text;
      if (!text.length) {
        return links;
      }
      links = text
        .split('"')
        .filter(item => item.indexOf(`${window.location.origin}/media`) === 0)
        .map(item => {
          const index = item.indexOf("/media");
          return item.slice(index);
        });
      return links;
    }
  }
};
</script>
