<template>
  <div class="settings">
    <div class="container">
      <div class="row">
        <div class="content-col" :class="{ 'hidden-mobile': isHome }">
          <div class="rounded-container">
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
import MobileMixin from "@/mixins/settings/mobile";

export default {
  name: "Settings",

  mixins: [MobileMixin],

  components: {
    Aside,
    DefaultSection
  }
};
</script>
