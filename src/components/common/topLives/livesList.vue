<template>
  <div
    class="storyView storyView_top-live storyView_top-live__list live-list-wrapper"
  >
    <div class="story" v-for="item in lives" :key="item.id">
      <div class="avatar avatar_lg avatar_lg-desk" @click="openLive(item)">
        <span class="with-story">
          <span class="avatar__img">
            <img :src="item.user.avatar" v-if="item.user.avatar" />
          </span>
        </span>
        <div class="stream-online-label">live</div>
      </div>
      <div class="story-info">
        <div class="story-header">
          <div class="name">
            <div class="name-switcher">
              <span class="active">
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
  name: "TopLivesList",
  mixins: [AccessMixin],
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
    openLive(stream) {
      this.tryOpenStream({ ...stream.user }, { ...stream }, stream => {
        this.openStream(stream);
      });
    }
  }
};
</script>
