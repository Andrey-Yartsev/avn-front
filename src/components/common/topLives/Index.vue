<template>
  <div class="storyView storyView_top-live">
    <div class="story">
      <div class="avatar avatar_lg avatar_lg-desk" @click="openLive">
        <span class="with-story" :class="{ avatar__slider: lives.length > 1 }">
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
            v-if="lives.length > 1"
          >
            <span class="avatar__img">
              <img :src="item.user.avatar" v-if="item.user.avatar" />
            </span>
          </span>
          <span class="avatar__img" v-else>
            <img :src="item.user.avatar" v-if="item.user.avatar" />
          </span>
        </span>
        <div class="stream-online-label">live</div>
      </div>
      <div class="story-info">
        <div class="story-header">
          <div class="name">
            <strong>Top Live</strong>
            <div class="name-switcher">
              <span
                v-for="(item, key) in lives"
                v-bind:key="key"
                :class="{
                  active: key === current
                }"
              >
                {{ item.user.name }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AccessMixin from "@/components/stream/mixins/access";

export default {
  name: "TopLives",
  mixins: [AccessMixin],
  data() {
    return {
      current: 0,
      nextItem: 0,
      openingUserId: 0,
      openingStream: null
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
    },
    stream() {
      return this.lives[this.current];
    },
    streamer() {
      return this.stream.user;
    },
    subsUpdate() {
      return this.$store.state.subscription.updated;
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
    },
    openLive() {
      this.tryOpenStream({ ...this.streamer }, { ...this.stream }, stream => {
        this._openStream(stream);
      });
    },
    _openStream(stream) {
      if (this.lives[this.current]) {
        this.openStream(stream);
      }
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
    },
    subsUpdate(data) {
      if (!this.openingUser) {
        // available only when click was on that component
        return;
      }
      if (data.action === "subscribe") {
        if (data.data.userId === this.openingUser.id) {
          this.openStream();
        }
      }
    }
  }
};
</script>
