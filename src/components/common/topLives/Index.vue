<template>
  <div class="exploreAllStoriesView">
    <div class="explore-all-story">
      <router-link to="explore/live" class="avatar with-story">
        <span class="avatar__slider">
          <span :class="['avatar__slide', {
            active: key === current,
            'active-next': key === nextItem
          }]" v-for="(item, key) in lives" v-bind:key="key">
            <img :src="item.user.avatar" v-if="item.user.avatar">
          </span>
        </span>
        <div class="stream-online-label">live</div>
      </router-link>
      <span class="live-explore-title">
        Top Live
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "TopLives",
  data() {
    return {
      current: 0,
      nextItem: 1
    };
  },
  props: {
    lives: {
      type: Array,
      required: true
    }
  },
  mounted() {
    setInterval(() => {
      this.current =
        this.current < this.lives.length - 1 ? this.current + 1 : 0;
      this.nextItem =
        this.nextItem < this.lives.length - 1 ? this.nextItem + 1 : 0;
    }, 2000);
  }
};
</script>
