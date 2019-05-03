<template>
  <div class="special-container">
    <div class="white-bg-block">
      <div
        class="bg-profile bg-profile_sticky bg-profile_sticky-lg bg-profile_height bg-profile_height-exlg size-lg"
      >
        <div class="bg-wrap bg-color bg-gradient_standart">
          <div class="container">
            <Header />
          </div>
        </div>
      </div>
      <div class="content-wrapper">
        <slot name="content" />
      </div>
    </div>
    <Footer class="site-footer_main" />
  </div>
</template>
<script>
import Header from "./Header";
import Footer from "@/components/footer/Index";

export default {
  name: "SearchCenterContentWrapper",
  components: {
    Header,
    Footer
  },
  mounted() {
    this.$store.dispatch("support/fetch");
    this.$store.dispatch("support/fetchTrending");
  }
};
</script>
