<template>
  <div class="container awards">
    <div class="awards-header" :class="{ gay: isGay }">
      <img
        :src="process.env.VUE_APP_CDN_PATH + 'static/img/avnawards.png'"
        alt=""
        class="logo-awards"
        v-if="!isGay"
      />
      <GayLogo v-else />
    </div>
    <template v-if="isGay">
      <Banner
        v-if="!isVotingGayEnabled"
        :title="banner.title"
        :text="banner.text"
      />
      <Content v-else :type="'gay'" />
    </template>
    <template v-else>
      <Banner
        v-if="!isVotingEnabled"
        :title="banner.title"
        :text="banner.text"
      />
      <Content v-else :type="'straight'" />
    </template>
  </div>
</template>

<script>
import GayLogo from "../GayLogo";
import Banner from "./Banner";
import Content from "./Content";
import User from "@/mixins/user";

export default {
  mixins: [User],
  components: {
    GayLogo,
    Banner,
    Content
  },
  data() {
    return {
      banner: {
        title: "Voting Not Open Yet!",
        text: "Voting has not begun yet but will open soon."
      }
    };
  },
  computed: {
    isGay() {
      return this.$route.meta.isGay;
    },
    isVotingEnabled() {
      return (
        this.$store.state.init.data.enableVoting ||
        (this.user && this.user.adminReturnUrl) ||
        (this.user && this.user.showVote)
      );
    },
    isVotingGayEnabled() {
      return (
        this.$store.state.init.data.enableGayVoting ||
        (this.user && this.user.adminReturnUrl) ||
        (this.user && this.user.showVote)
      );
    }
  }
};
</script>
