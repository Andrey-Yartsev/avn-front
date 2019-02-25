<template>
  <div class="special-container">
    <div class="white-bg-block">
      <div class="bg-profile size-lg">
        <div class="bg-wrap bg-color bg-gradient_standart">
          <div class="container">
            <Header />
          </div>
        </div>
      </div>
      <div class="s-container support-content">
        <div class="container">
          <slot name="content" />
        </div>
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
  }
};
</script>
