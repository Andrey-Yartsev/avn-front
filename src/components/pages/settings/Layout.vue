<template>
  <div class="settings">
    <div class="container">
      <div class="row">
        <div class="content-col" :class="{'hidden-mobile': hideContentOnMobile}">
          <div class="rounded-container rounded-container_fluid-height">
            <slot name="content" />
          </div>
          <div class="site-footer hidden-mobile">
            <div class="container"></div>
          </div>
        </div>
        <Aside />
      </div>
    </div>
  </div>
</template>

<script>
import Aside from "./Aside";
import DefaultSection from "./default/Content";

export default {
  name: "Settings",

  components: {
    Aside,
    DefaultSection
  },

  computed: {
    hideContentOnMobile() {
      return this.$route.name === "Settings";
    }
  }
};
</script>
