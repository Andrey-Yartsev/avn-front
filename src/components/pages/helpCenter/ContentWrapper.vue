<template>
  <div class="special-container">
    <div class="sticky-header-controls">
      <div class="profile-name__header">
        Help Center
      </div>
    </div>
    <div class="white-bg-block">
      <div class="bg-profile size-lg">
        <div class="bg-wrap bg-color bg-gradient_standart">
          <div class="container">
            <Header />
          </div>
        </div>
      </div>
      <div>
        <slot name="content" />
      </div>
      <Footer class="site-footer_main" />
    </div>
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
  }
};
</script>
