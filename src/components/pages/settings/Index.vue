<template>
  <div class="settings">
    <div class="container">
      <div class="row">
        <div class="content-col" :class="{ 'hidden-mobile': isHome }">
          <div class="rounded-container rounded-container_fluid-height">
            <DefaultSection />
          </div>
          <div class="site-footer hidden-mobile" v-if="$mq === 'desktop'">
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
import DefaultSection from "./default/Index";
import Mobile from "./mobile";

export default {
  name: "Settings",

  mixins: [Mobile],

  components: {
    Aside,
    DefaultSection
  }
};
</script>
