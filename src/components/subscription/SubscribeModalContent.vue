<template>
  <div class="subscribePopupView">
    <div class="subscribe-popup__header bg bg-color bg-gradient_standart">
      <img v-if="profile.header" :src="profile.header" />
    </div>

    <div class="subscribe-popup__info">
      <div class="subscribe-popup__info-avatar">
        <span class="avatar avatar_mex-lg"
          ><span class="avatar__img"
            ><img v-if="profile.avatar" :src="profile.avatar"/></span
        ></span>
      </div>

      <div class="user-names">
        <div class="wrap-name">
          <router-link :to="'/' + profile.username" class="name">{{
            profile.name
          }}</router-link>
          <span v-if="profile.isVerified" class="verified-user"></span>
        </div>
        <div class="user-login reset-ml">
          <router-link :to="'/' + profile.username">{{
            profile.username
          }}</router-link>
        </div>
      </div>
    </div>

    <div class="subscribe-popup__body">
      <p class="subscribe-popup__body-title">
        Subscription Benefits
      </p>
      <div v-html="benefits"></div>
    </div>

    <div class="subscribe-popup__footer">
      <button
        @click="$emit('subscribe')"
        type="submit"
        class="btn lg primary-color"
        id="subscribe-proceed"
        :disabled="progress"
      >
        <slot name="button-text" />
      </button>
      <p class="subscribe-popup__footer-text">
        <slot name="footer-text" />
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "SubscribeModalContent",
  props: {
    profile: {
      type: Object,
      required: true
    },
    progress: {
      type: Boolean,
      require: true,
      default: false
    }
  },
  computed: {
    benefits() {
      if (!this.$store.state.init.data.messages) {
        return null;
      }
      return this.$store.state.init.data.messages.subscriptionBenefits;
    }
  }
};
</script>
