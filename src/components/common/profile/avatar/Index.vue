<template>
  <div class="profile-images__inner">
    <router-link :to="`/stories/${profile.id}`" v-if="profile.hasNotViewedStory">
        <span class="avatar with-story" :style="{ fontSize: fontSize}">
          <img :src="profile.avatar" v-if="profile.avatar">
        </span>
    </router-link>
    <span v-else class="avatar" :style="{ fontSize: fontSize}">
        <img :src="profile.avatar" v-if="profile.avatar">
    </span>
  </div>
</template>

<script>
export default {
  name: "ProfileAvatar",
  props: {
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
  methods: {
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
