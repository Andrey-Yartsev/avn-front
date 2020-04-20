<template>
  <div class="subscribePopupView">
    <div
      class="subscribe-popup__header bg-profile bg-profile_height-extrasm bg-color bg-gradient_standart pos-relative"
    >
      <img v-if="profile.header" :src="profile.header" />
    </div>

    <div class="subscribe-popup__info">
      <div class="subscribe-popup__info-avatar">
        <span
          class="avatar avatar_mex-lg"
          :class="{ 'online-state': isOnline(profile.id) }"
          ><span class="avatar__img"
            ><img v-if="profile.avatar" :src="profile.avatar"/></span
        ></span>
      </div>

      <div class="user-names">
        <div class="wrap-name">
          <router-link :to="'/' + profile.username" class="name">{{
            profile.name
          }}</router-link>
          <span
            class="verified-user icn-item"
            :class="{
              fullyMonetized: profile.canEarn && profile.canPayoutsRequest
            }"
            v-if="
              profile.isVerified ||
                (profile.canEarn && profile.canPayoutsRequest)
            "
          ></span>
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
        class="btn lg block"
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
import User from "@/mixins/user";

export default {
  name: "SubscribeModalContent",
  mixins: [User],
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
