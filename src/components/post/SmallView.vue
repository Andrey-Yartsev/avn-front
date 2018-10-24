<template>
    <div class="photoView" :data-id="post.id">
        <a
          :class="['postLink', {
            'photo-post': post.mediaType === 'image', 
            'video-post': post.mediaType === 'video'
          }]"
          :href="`/post/${post.id}`"
          @click.prevent="openModal"
        >
            <figure :class="{'locked-wrapper': media.locked}">
                <div v-if="!media.canView" class="locked-picture">
                    <img class="locked" :src="'data:image/jpeg;base64,' + media.locked">
                </div>
                <template v-else>
                    <img  :src="media.thumb.source">
                    <span v-if="post.media.length > 1" class="count">
                        <span class="value">{{ post.media.length }}</span>
                    </span>
                    <span class="overlay">
                        <span class="likes">{{ post.favoritesCount }}</span>
                        <span class="comments">{{ post.commentsCount }}</span>
                    </span>
                </template>
            </figure>
        </a>
    </div>
</template>

<script>
export default {
  name: "Post",
  props: {
    post: {
      type: Object,
      required: true
    },
    from: {
      type: String,
      required: true
    }
  },
  computed: {
    actionPrefix() {
      return this.from;
    },
    media() {
      return this.post.media[0];
    }
  },
  methods: {
    openModal() {
      if (this.media.locked) {
        return;
      }
      this.$store.dispatch(
        "modalRouter/updatePath",
        `post/${this.post.id}/${this.from}`
      );
    },
    getComments() {
      const { id, commentsCount, canComment } = this.post;

      if (commentsCount && canComment) {
        this.$store.dispatch(this.actionPrefix + "/getPostComments", {
          postId: id
        });
      }
    }
  },
  created() {
    this.getComments();
  }
};
</script>
