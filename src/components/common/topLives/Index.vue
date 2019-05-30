<template>
  <div class="storyView storyView_top-live">
    <div class="story">
      <router-link to="explore/live" class="avatar avatar_lg avatar_lg-desk">
        <span class="avatar__slider with-story">
          <span
            :class="[
              'avatar__slide',
              {
                active: key === current,
                'active-next': key === nextItem
              }
            ]"
            v-for="(item, key) in lives"
            v-bind:key="key"
          >
            <span class="avatar__img">
              <img :src="item.user.avatar" v-if="item.user.avatar" />
            </span>
          </span>
        </span>
        <div class="stream-online-label">live</div>
      </router-link>
      <div class="story-info">
        <div class="story-header">
          <div class="name">
            Top Live
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TopLives",
  data() {
    return {
      current: 0,
      nextItem: 0
    };
  },
  props: {
    lives: {
      type: Array,
      defaults: []
    }
  },
  computed: {
    length() {
      return this.lives.length;
    }
  },
  methods: {
    setData() {
      this.current = 0;
      this.nextItem = this.lives.length > 1 ? 1 : 0;
    },
    run() {
      this.interval = setInterval(() => {
        this.current = this.current < this.length - 1 ? this.current + 1 : 0;
        this.nextItem = this.nextItem < this.length - 1 ? this.nextItem + 1 : 0;
      }, 2500);
    },
    init() {
      this.setData();
      this.run();
    }
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  watch: {
    lives() {
      this.init();
    }
  }
};
</script>
