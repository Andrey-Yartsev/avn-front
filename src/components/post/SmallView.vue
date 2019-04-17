<template>
  <div
    :class="[
      'explore-item explore-item_col',
      {
        'explore-item_col-3': !shouldBePoster,
        'explore-item_double': shouldBePoster
      }
    ]"
    :data-id="post.id"
    :id="'p' + post.id"
  >
    <a
      :class="[
        'postLink',
        {
          'photo-post': post.mediaType === 'image',
          'video-post': post.mediaType === 'video'
        }
      ]"
      :href="`/post/${post.id}`"
      @click.prevent="openModal"
    >
      <figure
        v-if="media"
        class="explore-media"
        :class="{ 'locked-wrapper': media.locked }"
      >
        <div v-if="!media.canView" class="locked-picture">
          <img class="locked" :src="'data:image/jpeg;base64,' + media.locked" />
        </div>
        <template v-else>
          <img :src="media.thumb.source" />
          <span
            v-if="post.media.length > 1"
            class="item-length item-length_photo"
          >
            <span class="value">{{ post.media.length }}</span>
          </span>
          <span
            v-if="media.duration && $mq === 'desktop'"
            class="item-length item-length_video hidden-mobile"
          >
            <span class="value">{{ mediaDuration }}</span>
          </span>
          <span class="overlay">
            <span class="likes">{{ post.favoritesCount }}</span>
            <span class="comments">{{ post.commentsCount }}</span>
          </span>
          <span class="explore-media__name" v-if="!shouldBePoster">{{
            post.author.name
          }}</span>
          <div
            class="video-placeholder"
            v-if="page === 'all' && shouldBePoster"
          >
            <span class="video-recommendations-text">
              Watch<br />videos you might like
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
import PostOpen from "@/mixins/postOpen";

export default {
  name: "Post",
  mixins: [ModalRouterGoto, PostOpen],
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
    },
    page() {
      return this.$route.meta.page;
    }
  }
};
</script>
