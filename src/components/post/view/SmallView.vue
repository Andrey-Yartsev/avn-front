<template>
  <div
    :class="[
      'explore-item explore-item_col bg-gradient bg-gradient_light',
      {
        'explore-item_col-3': !shouldBePoster,
        'explore-item_double': shouldBePoster,
        outofviewport: isVisible === false,
        'explore-media_processing': post.mediaType === 'processing',
        'explore-item_live': isExploreLivePage
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
          'video-post': post.mediaType === 'video',
          'locked-wrapper': media.locked || post.mediaType === 'processing'
        }
      ]"
      :href="`/post/${post.id}`"
      @click.prevent="openModal"
      @contextmenu.prevent="() => false"
      @dragstart.prevent="() => false"
    >
      <figure v-if="media" class="explore-media">
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
            v-if="media.duration && !shouldBePoster"
            class="item-length item-length_video"
          >
            <span class="value">{{ mediaDuration }}</span>
            <span
              class="icn-item"
              :class="{
                'icn-live': post.streamHasConverted,
                'icn-camera': !post.streamHasConverted
              }"
            ></span>
          </span>
          <span
            v-if="recordIcon"
            class="recordIcon"
            :class="{ small: $mq === 'mobile' }"
          >
            <img width="16" height="16" src="/static/img/tape.svg" />
          </span>
          <span class="overlay" v-if="$mq === 'desktop' && !shouldBePoster" />
          <div
            class="video-placeholder icn-item"
            v-if="page === 'all' && shouldBePoster"
          >
            <span class="video-recommendations-text">
              Watch<br />videos you might like
            </span>
          </div>

          <div
            class="loader-container loader-container_center"
            v-if="post.mediaType === 'processing'"
          >
            <Loader
              :fullscreen="false"
              text="Media is currently processing"
              class="processing-loader text-light"
              :small="true"
            />
          </div>
        </template>
      </figure>
    </a>
    <a
      :href="'/' + post.author.username"
      class="explore-media__name"
      v-if="!shouldBePoster && from !== 'profile/home'"
      :class="{ 'online-state': isOnline(post.author.id) }"
    >
      <span class="name">{{ post.author.name }}</span>
    </a>
    <template v-if="$mq === 'desktop' && !shouldBePoster">
      <span
        class="explore-media__counter explore-media__counter_likes"
        v-if="post.mediaType !== 'processing'"
      >
        <span class="btn-icon likes icn-item icn-size_lg" @click="like" />
        <span class="likes__counter" @click="showLikesModal">{{
          post.favoritesCount
        }}</span>
      </span>
      <span
        class="explore-media__counter explore-media__counter_comments"
        v-if="post.mediaType !== 'processing'"
        ><span class="btn-icon comments icn-item icn-size_lg"></span
        >{{ post.commentsCount }}</span
      >
    </template>
  </div>
</template>

<script>
import { toHumanDuration } from "@/helpers/datetime";
import ModalRouterGoto from "@/mixins/modalRouter/goto";
import PostOpen from "@/mixins/post/open";
import userMixin from "@/mixins/user";
import PostCommon from "@/mixins/post/common";
import Loader from "@/components/common/Loader";

export default {
  name: "Post",
  components: {
    Loader
  },
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
    },
    recordIcon: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    actionPrefix() {
      return this.from;
    },
    media() {
      if (!this.post.media || !this.post.media.length) {
        return {};
      }
      return this.post.media[0];
    },
    mediaDuration() {
      return this.media.duration ? toHumanDuration(this.media.duration) : "";
    },
    page() {
      return this.$route.meta.page;
    },
    isExploreLivePage() {
      return this.$route.name === "ExploreLive";
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
    },
    like() {
      if (!this.user) {
        this.$store.dispatch("modal/show", { name: "login" });
        return;
      }
      this.likePost();
    },
    showLikesModal() {
      if (this.post.favoritesCount === 0) return;

      if (!this.user) {
        this.$store.dispatch("modal/show", { name: "login" });
        return;
      }

      this.$store.dispatch("modal/show", {
        name: "postLikes",
        data: {
          postId: this.post.id
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.recordIcon {
  position: absolute;
  left: 16px;
  top: 16px;
  width: 23px;
  height: 23px;
  &.small {
    left: 5px;
    top: 6px;
    width: 18px;
    height: 18px;
  }
}
</style>
