<template>
  <div class="site-footer">
    <div class="container">
      <div class="FooterNavCollectionView">
        <div class="footer-nav">
          <div class="FooterNavView">
            <router-link to="/help">Help Center</router-link>
          </div>
          <div
            :class="[
              'FooterNavView',
              { 'settings-link': key === pages.length - 1 }
            ]"
            v-for="(page, key) in pages"
            :key="page.name"
          >
            <template v-if="isExternal(page.url)">
              <a :href="page.url" target="_blank">{{ page.name }}</a>
            </template>
            <template v-else>
              <router-link :to="page.url">{{ page.name }}</router-link>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Footer",
  data() {
    return {
      location: global.location.pathname
    };
  },
  computed: {
    pages() {
      return this.$store.state.common.pages.filter(page => {
        return page.url !== this.location;
      });
    }
  },
  methods: {
    isExternal(url) {
      return url.match(/^http.*/);
    }
  },
  created() {
    if (!this.$store.state.common.pages.length) {
      this.$store.dispatch("common/getPages");
    }
  },
  watch: {
    $route() {
      this.location = global.location.pathname;
    }
  }
};
</script>
