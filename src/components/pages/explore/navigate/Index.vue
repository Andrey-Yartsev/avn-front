<template>
  <nav class="content-nav">
    <router-link to="/explore/all" data-type="all" class="content-nav__item">
      <span class="hidden-mobile">Explore all</span>
      <span class="hidden-desktop">All</span>
    </router-link>
    <router-link
      to="/explore/stories"
      class="content-nav__item"
      data-type="stories"
      >Stories</router-link
    >
    <router-link
      to="/explore/videos"
      class="content-nav__item"
      data-type="videos"
      >Videos</router-link
    >
    <router-link
      to="/explore/photos"
      class="content-nav__item"
      data-type="photos"
      >Photos</router-link
    >
    <router-link to="/explore/clips" class="content-nav__item" data-type="clips"
      >Clips</router-link
    >
    <router-link to="/explore/live" class="content-nav__item" data-type="live"
      >Live</router-link
    >
    <router-link to="/explore/top" class="content-nav__item" data-type="top"
      >Top
      <template v-if="$mq === 'desktop'"
        >Models</template
      ></router-link
    >
    <router-link to="/explore" exact class="content-nav__item" data-type="top"
      >Feed</router-link
    >
  </nav>
</template>

<script>
import GenderFilter from "@/components/common/GenderFilter";

export default {
  name: "ExploreNavigate",

  components: {
    GenderFilter
  }
};
</script>
