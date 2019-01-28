<template>
  <div class="profile-images__inner" :style="{ fontSize: fontSize }">
    <router-link
      :to="`/stories/${profile.id}`"
      v-if="profile.hasNotViewedStory && !showLiveLabel"
    >
      <span class="avatar with-story" :style="{ fontSize: fontSize }">
        <span class="avatar__img">
          <img :src="profile.avatar" v-if="profile.avatar" />
        </span>
      </span>
    </router-link>
    <span v-else class="avatar" @click="click">
      <span class="avatar__img">
        <img :src="profile.avatar" v-if="profile.avatar" />
      </span>
      <div class="stream-online-label" v-if="showLiveLabel">live</div>
    </span>
    <div
      :class="[
        'profile-name-sticky',
        'hidden-mobile',
        { 'profile-position': profileExtraClass }
      ]"
    >
      <div class="profile-name profile-name_base">
        <div class="profile-name__main">
          <span class="name">
            {{ profile.name }}
          </span>
          <span class="verified-user" v-if="profile.isVerified"></span>
          <div class="block-indicator" v-if="profile.isBlocked">
            <span class="icn-block icn-item"></span>
          </div>
        </div>
        <span class="user-login reset-ml">
          <router-link :to="'/' + profile.username">{{
            profile.username
          }}</router-link>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProfileAvatar",
  props: {
    pageName: {
      type: String,
      default: ""
    },
    profile: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      scrollTop: 0,
      fontSize: 0,
      avatarSize: 0,
      avatarSizeScrolled: 0,
      coverScrollHeight: 0
    };
  },
  computed: {
    showLiveLabel() {
      return !!this.profile.currentStream;
    },
    profileExtraClass() {
      return ["posts", ""].indexOf(this.pageName) !== -1;
    }
  },
  methods: {
    click() {
      if (this.profile.currentStream) {
        this.$store.dispatch("modal/show", {
          name: "stream",
          data: {
            stream: this.profile.currentStream
          }
        });
      }
    },
    updateParams() {
      if (this.$mq !== "desktop") {
        this.avatarSize = 100;
        this.avatarSizeScrolled = 50;
        this.coverScrollHeight =
          document.documentElement.offsetWidth * 0.32 - 44;
      } else {
        this.avatarSize = 200;
        this.avatarSizeScrolled = 40;
        this.coverScrollHeight = 240;
      }
    },
    onScrollHandler() {
      const docScrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      const percent = Math.min(docScrollTop / this.coverScrollHeight, 1);

      if (percent === 1) {
        document.body.classList.add("header-scrolled");
      } else {
        document.body.classList.remove("header-scrolled");
      }

      this.fontSize = `${(1 - percent) *
        (this.avatarSize - this.avatarSizeScrolled) +
        this.avatarSizeScrolled}px`;
      this.scrollTop = docScrollTop;
    }
  },
  created() {
    this.updateParams();
    this.onScrollHandler();
  },
  mounted() {
    window.addEventListener("scroll", this.onScrollHandler);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.onScrollHandler);
  },
  watch: {
    ["$mq"]() {
      this.updateParams();
      let event;

      if (window.CustomEvent) {
        event = new CustomEvent("scroll", { detail: {} });
      } else {
        event = document.createEvent("CustomEvent");
        event.initCustomEvent("scroll", true, true, {});
      }

      window.dispatchEvent(event);
    }
  }
};
</script>
