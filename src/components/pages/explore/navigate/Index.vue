<template>
  <nav class="content-nav">
    <button>asd</button>
    <button @click="newLook">newLook</button>
    <button @click="newLook">newLook</button>
    {{ $store.state.lives.notifications }}
    <router-link to="/explore/all" data-type="all" class="content-nav__item">
      <span class="hidden-mobile content-nav__item-label">Explore all</span>
      <span class="hidden-desktop content-nav__item-label">All</span>
    </router-link>
    <router-link
      to="/explore/stories"
      class="content-nav__item"
      data-type="stories"
      ><span class="content-nav__item-label">Stories</span></router-link
    >
    <router-link to="/explore/media" class="content-nav__item" data-type="media"
      ><span class="content-nav__item-label">Media</span></router-link
    >
    <router-link to="/explore/clips" class="content-nav__item" data-type="clips"
      ><span class="content-nav__item-label">Clips</span></router-link
    >
    <router-link to="/explore/live" class="content-nav__item" data-type="live"
      ><span class="content-nav__item-label">Live</span></router-link
    >
    <router-link to="/explore/top" class="content-nav__item" data-type="top"
      ><span class="content-nav__item-label"
        >Top
        <template v-if="$mq === 'desktop'"
          >Models</template
        ></span
      ></router-link
    >
    <router-link to="/explore" exact class="content-nav__item" data-type="top"
      ><span class="content-nav__item-label">Feed</span></router-link
    >
    <router-link
      v-if="contestsEnabled"
      to="/contests"
      class="content-nav__item"
      data-type="top"
      ><span class="content-nav__item-label">Contests</span></router-link
    >
  </nav>
</template>

<script>
import GenderFilter from "@/components/common/GenderFilter";

export default {
  name: "ExploreNavigate",

  components: {
    GenderFilter
  },
  computed: {
    user() {
      return this.$store.state.auth.user;
    },
    contestsEnabled() {
      return (
        this.user?.showVote || // showVote is admin user, renamed for secure reason
        this.user?.adminReturnUrl ||
        this.$store.state.init.data?.enableContests
      );
    }
  },
  methods: {
    newLook() {
      setTimeout(() => {
        this.$store.dispatch("lives/notifications/play", "newLook");
      }, 5000);
    }
  },
  mounted() {
    this.$store.dispatch("lives/notifications/init");
  }
};
</script>
