<template>
  <div class="explore-item explore-item_col explore-item_col-4 liveView" @click="run">
    <div class="postLink live">
      <figure class="explore-media">
        <img :src="post.thumbUrl">
        <div v-if="duraion" class="item-length item-length_live hidden-mobile">
          <span class="value">{{ duraion }}</span>
        </div>
        <div class="overlay">
          <span class="likes">{{ post.likesCount }}</span>
          <span class="looking">{{ post.viewsCount }}</span>
        </div>
        <div class="live-short-info">
          <span class="looking">{{ post.viewsCount }}</span>
            <span class="name">{{ user.name }}
            <span v-if="user.isVerified" class="verified-user" />
          </span>
        </div>
      </figure>
    </div>
  </div>
</template>

<script>
export default {
  name: "Live",
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  computed: {
    user() {
      return this.post.user;
    },
    duraion() {
      const time = this.post.startedAt;
      const date = Math.round(new Date(time).getTime() / 1000);
      const today = Math.round(Date.now() / 1000);
      const diff = today - date;
      let hours;
      let minutes;
      let result = "";
      if (3600 <= diff) {
        hours = Math.floor(diff / 3600);
        result = hours + " h";
      } else if (60 <= diff) {
        minutes = Math.ceil(diff / 300) * 5;
        result = minutes + " min";
      }
      return result;
    }
  },
  methods: {
    run() {
      this.$store.dispatch("modal/show", {
        name: "stream",
        data: {
          stream: this.post
        }
      });
    }
  }
};
</script>
