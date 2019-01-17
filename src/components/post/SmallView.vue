<template>
  <div
    :class="[
      'explore-item explore-item_col',
      {
        'explore-item_col-3': !shouldBePoster,
        'explore-item_double': shouldBePoster
      }]"
      :data-id="post.id">
    <a
      :class="['postLink', {
        'photo-post': post.mediaType === 'image', 
        'video-post': post.mediaType === 'video'
      }]"
      :href="`/post/${post.id}`"
      @click.prevent="openModal"
    >
      <figure v-if="media" class="explore-media" :class="{'locked-wrapper': media.locked}">
        <div v-if="!media.canView" class="locked-picture">
          <img class="locked" :src="'data:image/jpeg;base64,' + media.locked">
        </div>
        <template v-else>
          <img  :src="media.thumb.source">
          <span v-if="post.media.length > 1" class="item-length item-length_photo">
            <span class="value">{{ post.media.length }}</span>
          </span>
          <span v-if="media.duration" class="item-length item-length_video hidden-mobile">
            <span class="value">{{ mediaDuration }}</span>
          </span>
          <span class="overlay">
            <span class="likes">{{ post.favoritesCount }}</span>
            <span class="comments">{{ post.commentsCount }}</span>
          </span>
          <div class="video-placeholder">
            <span class="video-recommendations-text">
              Watch<br>videos you might like
            </span>
          </div>
        </template>
      </figure>
    </a>
  </div>
</template>

<script>
import { toHumanDuration } from "@/helpers/datetime";
import ModalRouterGoto from "@/mixins/modalRouter/goto";

export default {
  name: "Post",
  mixins: [ModalRouterGoto],
  props: {
    post: {
      type: Object,
      required: true
    },
    from: {
      type: String,
      required: true
    },
    shouldBePoster: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    actionPrefix() {
      return this.from;
    },
    media() {
      return this.post.media[0];
    },
    mediaDuration() {
      return this.media.duration ? toHumanDuration(this.media.duration) : "";
    }
  },
  methods: {
    openModal() {
      if (this.media.locked) {
        return;
      }
      this.goToModalRoute(`post/${this.post.id}/${this.from}`);
    }
  }
};
</script>
