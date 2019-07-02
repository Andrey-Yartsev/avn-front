<template>
  <div class="comments-list stream-comments-wrapper">
    <perfect-scrollbar id="scroll" class="comments-list-scrolling">
      <div
        class="comment stream-message"
        v-for="item in items"
        :key="item.user.id + Date.now()"
      >
        <span class="avatar avatar_not-shadow avatar_ex-sm avatar_gap-r-sm">
          <span class="avatar__img">
            <img :src="item.user.avatar" v-if="item.user.avatar" />
          </span>
        </span>
        <div class="comment-content stream-message__head">
          <div class="comment-body">
            <span class="name">{{ item.user.name || "Guest" }}</span>
            <span class="comment-text stream-message__text">
              <span class="icn-item icn-size_md" :class="className" />
              {{ type === "like" ? getCount(item.user.id) : "" }}
              {{ type === "tip" ? item.amount.toFixed(2) : "" }}
            </span>
          </div>
        </div>
      </div>
    </perfect-scrollbar>
  </div>
</template>

<script>
import uniqBy from "lodash.uniqby";

export default {
  name: "StreamViewers",
  props: {
    type: {
      type: String,
      required: true
    }
  },
  methods: {
    getCount(id) {
      return this.$store.state.lives.currentLive.likers.filter(
        i => i.user.id === id
      ).length;
    }
  },
  computed: {
    className() {
      if (this.type === "view") return "looking";
      if (this.type === "tip") return "icn-tips";
      if (this.type === "like") return "likes";
    },
    items() {
      if (this.type === "view")
        return this.$store.state.lives.currentLive.viewers;
      if (this.type === "tip")
        return this.$store.state.lives.currentLive.payers;
      if (this.type === "like")
        return uniqBy(this.$store.state.lives.currentLive.likers, "user.id");
    }
  }
};
</script>
