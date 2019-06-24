<template>
  <div
    :class="[
      'explore-item explore-item_col bg-gradient bg-gradient_light',
      {
        'explore-item_col-3': !shouldBePoster,
        'explore-item_double': shouldBePoster,
        outofviewport: isVisible === false
      }
    ]"
    :data-id="post.id"
    :id="'p' + post.id"
    v-observe-visibility="visibilityChanged"
  >
    <div
      v-if="isVisible === false"
      :style="{ height: `${height}px` }"
      class="postLink"
    />
    <a
      v-else
      :class="[
        'postLink',
        {
          'photo-post': post.mediaType === 'image',
          'video-post': post.mediaType === 'video'
        }
      ]"
      :href="`/post/${post.id}`"
      @click.prevent="openModal"
      @contextmenu.prevent="() => false"
      @dragstart.prevent="() => false"
    >
      <figure
        v-if="media"
        class="explore-media"
        :class="{
          'explore-media_processing': post.mediaType === 'processing',
          'locked-wrapper': media.locked || post.mediaType === 'processing'
        }"
      >
        <div
          v-if="!media.canView"
          class="locked-picture icn-item icn-pos_center"
        >
          <img
            class="locked"
            :src="'data:image/jpeg;base64,' + media.locked"
            @contextmenu.prevent="() => false"
            @dragstart.prevent="() => false"
          />
        </div>
        <template v-else>
          <img
            :src="media.thumb.source"
            @contextmenu.prevent="() => false"
            @dragstart.prevent="() => false"
          />
          <span
            v-if="post.media.length > 1"
            class="item-length item-length_photo"
          >
            <span class="value" v-if="$mq === 'desktop'">{{
              post.media.length
            }}</span>
            <span class="icn-item icn-photos"></span>
          </span>
          <span
            v-if="media.duration && $mq === 'desktop'"
            class="item-length item-length_video hidden-mobile"
          >
            <span class="value">{{ mediaDuration }}</span>
            <span class="icn-item icn-camera"></span>
          </span>
          <span class="overlay" v-if="$mq === 'desktop' && !shouldBePoster" />
          <span
            class="explore-media__name"
            v-if="!shouldBePoster && from !== 'profile/home'"
          >
            <span class="name">{{ post.author.name }}</span>
          </span>
          <div
            class="video-placeholder icn-item"
            v-if="page === 'all' && shouldBePoster"
          >
            <span class="video-recommendations-text">
              Watch<br />videos you might like
            </span>
          </div>

          <div
            v-if="post.mediaType === 'processing'"
            class="lds-dual-ring transparent small with-text not-fullscreen processing-loader"
          >
            <div class="loader-text">Media is currently processing</div>
          </div>
        </template>
      </figure>
    </a>
    <span
      class="explore-media__counter explore-media__counter_likes"
      @click="likePost"
      ><span class="btn-icon likes icn-item icn-size_lg"></span
      >{{ post.favoritesCount }}</span
    >
    <span class="explore-media__counter explore-media__counter_comments"
      ><span class="btn-icon comments icn-item icn-size_lg"></span
      >{{ post.commentsCount }}</span
    >
  </div>
</template>

<script>
import { toHumanDuration } from "@/helpers/datetime";
import ModalRouterGoto from "@/mixins/modalRouter/goto";
import PostOpen from "@/mixins/postOpen";
import userMixin from "@/mixins/user";
import PostCommon from "@/mixins/postCommon";

export default {
  name: "Post",
  mixins: [ModalRouterGoto, PostOpen, userMixin, PostCommon],
  data() {
    return {
      isVisible: undefined,
      height: undefined
    };
  },
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
  },
  methods: {
    visibilityChanged(isVisible, entry) {
      const isOpenedModal = document.body.classList.contains("modal-opened");
      if (isVisible === false && isOpenedModal) {
        return;
      }

      this.isVisible = isVisible;
      this.height = entry.boundingClientRect.height;
    }
  }
};
</script>
