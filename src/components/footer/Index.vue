<template>
    <div class="site-footer">
        <div class="container">
            <div class="FooterNavCollectionView">
                <div id="footer-nav" class="footer-nav aside">
                    <div :class="['FooterNavView', {'settings-onmyteam-link': key === pages.length - 1}]" v-for="(page, key) in pages" :key="page.name">
                        <router-link :to="page.url">{{ page.name }}</router-link>
                    </div>
                </div>
                <div id="second-footer-nav" class="footer-nav second-footer-nav">
                    <div class="FooterNavView"><router-link to="/2257">18 U.S.C. 2257 Record-Keeping Requirements Compliance Statement</router-link></div>
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
  created() {
    this.$store.dispatch("common/getPages");
  }
};
</script>
