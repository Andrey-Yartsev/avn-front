<template>
  <div class="userView userView_dropdown userView_dropdown-up" ref="bubble">
    <div v-if="show">
      <Loader
        :fullscreen="false"
        text=""
        class="transparent small"
        v-if="loading"
      />
      <template v-else>
        <div class="arrow">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            width="300"
            height="100"
            viewBox="0 0 600 200"
          >
            <defs>
              <clipPath id="clipping">
                <polygon points="50,10 60,0 70,10 50,10"></polygon>
              </clipPath>
            </defs>
            <image
              :xlink:href="profile.avatar"
              width="480"
              height="360"
              clip-path="url(#clipping)"
            ></image>
          </svg>
        </div>
        <div class="bg bg-color bg-gradient_light">
          <img v-if="profile.header" :src="profile.header" />
        </div>
        <div class="user-container">
          <div class="avatar avatar_md avatar_md-desk">
            <span class="avatar__img">
              <img :src="profile.avatar" />
            </span>
            <!--<div class="stream-online-label">live</div>-->
          </div>
          <div class="names-actions-wrapper">
            <div class="user-names">
              <div class="wrap-name">
                <a :href="'/' + profile.username" class="name">{{
                  profile.name
                }}</a>
                <span class="verified-user" v-if="profile.isVerified"></span>
                <!-- <span class="follow-link">Follow</span> -->
              </div>
              <span class="user-login reset-ml">
                <a :href="'/' + profile.username">{{ profile.name }}</a>
              </span>
            </div>
          </div>
          <p class="profile-text" v-html="profile.about"></p>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";
import Bubble from "@/helpers/bubble";

export default {
  name: "UserBubble",
  components: {
    Loader
  },
  props: {
    username: {
      type: String,
      required: true
    }
  },
  computed: {
    show() {
      return this.$store.state.userBubble.show;
    },
    loading() {
      return this.$store.state.userBubble._fetchLoading;
    },
    profile() {
      return this.$store.state.userBubble._fetchResult;
    }
  },
  mounted() {
    const bubble = this.$refs.bubble;
    bubble.addEventListener("mouseover", Bubble.show);
    bubble.addEventListener("mouseout", Bubble.hide);
  }
};
</script>
