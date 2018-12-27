<template>
  <div class="site-footer">
    <div class="container">
      <div class="FooterNavCollectionView">
        <div class="footer-nav">
          <div :class="['FooterNavView', {'settings-onmyteam-link': key === pages.length - 1}]"
            v-for="(page, key) in pages"
            :key="page.name"
            v-if="shouldShowLink(page.url)"
          >
            <template v-if="isExternal(page.url)">
              <a :href="page.url" target="_blank">{{ page.name }}</a>
            </template>
            <template v-else>
              <router-link :to="page.url">{{ page.name }}</router-link>
            </template>
          </div>
          <div class="FooterNavView">
            <router-link to="/2257">USC2257</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Footer",
  computed: {
    pages() {
      const length = this.$store.state.common.pages.length;
      return this.$store.state.common.pages.slice(0, length - 1);
    },
    last() {
      const length = this.$store.state.common.pages.length;
      return this.$store.state.common.pages[length - 1];
    }
  },
  methods: {
    isExternal(url) {
      return url.match(/^http.*/);
    },
    shouldShowLink(link) {
      return window.location.pathname !== link;
    }
  },
  created() {
    this.$store.dispatch("common/getPages");
  }
};
</script>
