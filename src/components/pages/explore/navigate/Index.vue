<template>
    <nav class="explore-nav">
        <router-link to="/explore" data-type="all" exact class="explore-nav__item">
            <span class="hidden-mobile">Explore all</span>
            <span class="hidden-desktop">All</span>
        </router-link>
        <router-link to="/explore/stories" class="explore-nav__item" data-type="stories">Stories</router-link>
        <router-link to="/explore/videos" class="explore-nav__item" data-type="videos">Videos</router-link>
        <router-link to="/explore/photos" class="explore-nav__item" data-type="photos">Photos</router-link>
        <router-link to="/explore/live" class="explore-nav__item" data-type="live">Live</router-link>
    </nav>
</template>

<script>
export default {
  name: "ExploreNavigate"
};
</script>
