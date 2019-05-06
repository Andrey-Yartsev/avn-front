<template>
  <div class="staticPage">
    <div class="container container_sm-width">
      <h1>{{ title }}</h1>
      <div class="text" v-html="text" />
    </div>
    <Footer class="site-footer_main" />
  </div>
</template>

<script>
import Footer from "@/components/footer/Index.vue";

export default {
  name: "TermsPage",

  components: {
    Footer
  },
  computed: {
    title() {
      return this.$store.state.staticPage.content.title;
    },
    text() {
      return this.$store.state.staticPage.content.text;
    }
  },
  methods: {
    init() {
      this.$store.commit("staticPage/resetPageState");
      this.$store.dispatch("staticPage/getContent", this.$route.meta.apiPoint);
    }
  },
  created() {
    this.init();
  },
  watch: {
    $route() {
      this.init();
    }
  }
};
</script>
