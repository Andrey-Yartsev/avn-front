<template>
  <div class="link">
    <a :href="post.url" target="_blank">
      <img v-if="faviconIco" :src="faviconIco" alt="" />
      <div class="title">{{ post.title }}</div>
    </a>
  </div>
</template>

<script>
export default {
  name: "LinkPost",
  props: ["post"],
  computed: {
    faviconIco() {
      return this.getFaviconIco();
    }
  },
  methods: {
    getFaviconIco() {
      const fullPath = this.$props.post.url;
      if (fullPath.indexOf("//") === -1) return null;
      const fullPathArray = fullPath.split("//");
      const protocol = fullPathArray[0];
      const domen = fullPathArray[1].split("/")[0];
      const iconUrl = protocol + "//" + domen + "/favicon.ico";
      return iconUrl;
    }
  }
};
</script>

<style lang="scss" scoped>
.link {
  max-width: 400px;
  margin: auto;
  display: flex;
  align-items: center;
  a {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: center;
    img {
      width: 30px;
      height: 30px;
    }
  }
}
</style>
