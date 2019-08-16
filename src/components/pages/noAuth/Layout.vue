<template>
  <div :class="mainClass">
    <div class="login-wrapper">
      <div class="login-caption-col">
        <div class="login-caption">
          <component :is="logo" />
          <div class="promotion for-models" v-if="forModals">
            <p>80% Payouts Adult brand you can trust</p>
            <p>Offer free content or sell your content or both</p>
            <p>Broadcast live.<br />No shadow ban.<br />Regular payouts</p>
          </div>
          <p class="promotion" v-else>
            Coming together.
          </p>
        </div>
        <Footer v-if="$mq === 'desktop'" />
      </div>
      <div class="login-form-col auth-block">
        <slot name="content" />
        <Footer v-if="$mq === 'mobile'" />
      </div>
    </div>
  </div>
</template>

<script>
import Footer from "@/components/footer/Index";

export default {
  name: "NoAuthLayout",
  components: {
    Footer
  },
  props: {
    mainClass: {
      type: String,
      default: "login"
    }
  },
  computed: {
    logo() {
      return "rl-logo";
    },
    forModals() {
      return !!this.$route.meta.forModels;
    }
  }
};
</script>
