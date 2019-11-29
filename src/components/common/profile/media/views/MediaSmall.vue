<template>
  <div
    :class="[
      'explore-item explore-item_col bg-gradient bg-gradient_light',
      {
        'explore-item_col-3': !shouldBePoster,
        'explore-item_double': shouldBePoster,
        outofviewport: isVisible === false,
        'explore-media_processing': post.mediaType === 'processing'
      }
    ]"
    :data-id="post.productId"
    :id="'p' + post.productId"
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
          'locked-wrapper': post.locked || post.mediaType === 'processing'
        }
      ]"
      :href="`/post/${post.productId}`"
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
            :src="media.thumb.source"
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
          <span v-if="post.active" class="isActive icn-item verified-user" />
          <span class="item-length item-length_video">
            <span class="value">{{ post.price.toFixed(2) }}</span>
            <span class="icn-item  icn-tips"></span>
          </span>
          <span class="overlay" v-if="$mq === 'desktop' && !shouldBePoster" />
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
      <!-- <span
        class="explore-media__counter explore-media__counter_likes"
        v-if="post.mediaType !== 'processing'"
      >
        <span class="btn-icon looking icn-item icn-size_lg" />
        <span class="likes__counter">{{ post.views || 0 }}</span>
      </span> -->
      <span
        class="explore-media__counter explore-media__counter posCenter"
        v-if="post.mediaType !== 'processing'"
        ><span class="btn-icon icn-tips icn-item icn-size_lg"></span
        >{{ post.price.toFixed(2) }}</span
      >
    </template>
  </div>
</template>

<script>
import { toHumanDuration } from "@/helpers/datetime";
import Loader from "@/components/common/Loader";
import ModalRouterGoto from "@/mixins/modalRouter/goto";
import MediaOpen from "@/mixins/media/open";

export default {
  name: "MediaSmall",
  components: {
    Loader
  },
  mixins: [ModalRouterGoto, MediaOpen],
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
      return this.$props.post.media;
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
    },
    openModal() {
      if (!this.user) {
        this.$store.dispatch("modal/show", {
          name: "signup"
        });
        return;
      }
      if (this.shouldBePoster) {
        this.$router.push(
          `/explore/videos#m/media/${this.post.productId}/${this.from}`
        );
        return;
      }
      this.goToModalRoute(`media/${this.post.productId}/${this.from}`);
    }
  }
};
</script>

<style lang="scss" scoped>
.isActive {
  position: absolute;
  left: 10px;
  top: 15px;
}
.posCenter {
  /* transform: translateX(-50%); */
}
</style>
