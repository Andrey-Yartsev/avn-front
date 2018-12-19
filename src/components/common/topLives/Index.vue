<template>
  <div class="exploreAllStoriesView">
    <div class="explore-all-story">
      <router-link to="explore/live" class="avatar with-story">
        <span class="avatar__slider">
          <span :class="['avatar__slide', { active: key === current }]" v-for="(item, key) in lives" v-bind:key="key">
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
      current: 0
    };
  },
  props: {
    lives: {
      type: Array,
      default: () => [
        {
          user: {
            avatar:
              "https://media.team2.retloko.com/files/j/jf/jfk/jfkhlzooltscjljhniiux6tyx4v9ifpy1541781654/c160.jpg"
          }
        },
        {
          user: {
            avatar:
              "https://media.team2.retloko.com/files/r/rq/rqn/rqns0qvjklzdstvjfsbmgpoqeil0yabh1537866424/c320.jpg"
          }
        },
        {
          user: {
            avatar:
              "https://media.team2.retloko.com/files/n/ny/nyi/nyiguiqqlwf1u7x59epgr00wwnnlzsom1537704573/c320.jpg"
          }
        },
        {
          user: {
            avatar:
              "https://media.team2.retloko.com/files/m/mh/mh9/mh9pvyqlsbkuihfrx1rvleinvpzqaue81542411947/c320.jpg"
          }
        },
        {
          user: {
            avatar: undefined
          }
        }
      ]
    }
  },
  mounted() {
    setInterval(() => {
      this.current =
        this.current < this.lives.length - 1 ? this.current + 1 : 0;
    }, 2000);
  }
};
</script>
