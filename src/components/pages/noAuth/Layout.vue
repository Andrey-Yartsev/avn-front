<template>
  <div :class="mainClass">
    <div class="login-wrapper promotion-models">
      <div class="login-caption-col">
        <div class="login-caption">
          <Logo />
          <div class="promotion for-models alt-font" v-if="forModals">
            <p>80% Payouts Adult brand you can trust</p>
            <p>Offer free content or sell your content or both</p>
            <p>Broadcast live.<br />No shadow ban.<br />Regular payouts</p>
          </div>
          <p class="promotion alt-font" v-else>
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
import Logo from "@/components/common/Logo";

export default {
  name: "NoAuthLayout",
  components: {
    Footer,
    Logo
  },
  props: {
    mainClass: {
      type: String,
      default: "login"
    }
  },
  computed: {
    forModals() {
      return !!this.$route.meta.forModels;
    }
  }
};
</script>
