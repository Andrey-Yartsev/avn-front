<template>
  <div :class="mainClass">
    <div class="login-wrapper">
      <div class="login-caption-col">
        <div class="login-caption">
          <component :is="logo" />
          <p class="promotion">
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
    }
  }
};
</script>
