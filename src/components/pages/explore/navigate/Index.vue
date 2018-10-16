<template>
    <nav class="explore-nav">
        <router-link to="/explore" data-type="all"><span class="hidden-mobile">Explore all</span><span class="hidden-desktop">All</span></router-link>
        <router-link to="/explore/stories" class="" data-type="stories">Stories</router-link>
        <router-link to="/explore/videos" class="" data-type="videos">Videos</router-link>
        <router-link to="/explore/photos" class="" data-type="photos">Photos</router-link>
        <router-link to="/explore/live" class="" data-type="live">Live</router-link>
    </nav>
</template>

<script>
export default {
  name: "ExploreNavigate"
};
</script>
