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
        },
        'postLinkMedia'
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
          <div v-if="media.type === 'audio'" class="audioPreview">
            <img src="/static/img/volume.svg" />
            <audio controls controlsList="nodownload" :src="media.src.source" />
          </div>
          <img
            v-else
            class="locked"
            :src="media.thumb.source"
            @contextmenu.prevent="() => false"
            @dragstart.prevent="() => false"
          />
          <div class="statusWrapper contentCenter">
            <span
              v-if="post.pinned"
              class="icn-pin icn-item icn-size_md"
            ></span>
          </div>
          <div
            class="statusWrapper bottom"
            v-if="post.media.type !== 'processing'"
          >
            <span class="mediaStatus duration">
              <span>{{ getVideoDuration(post.media.duration) }}</span>
            </span>
            <span
              v-if="post.media.type === 'video'"
              class="mediaStatus duration"
            >
              <span>{{ getVideoResolution }}</span>
            </span>
          </div>
        </div>
        <template v-else>
          <div v-if="media.type === 'audio'" class="audioPreview">
            <img src="/static/img/volume.svg" />
            <audio controls controlsList="nodownload" :src="media.src.source" />
          </div>
          <img
            v-else
            :src="media.thumb.source"
            @contextmenu.prevent="() => false"
            @dragstart.prevent="() => false"
          />
          <template v-if="isPrivate">
            <div class="statusWrapper top">
              <span v-if="post.active" class="mediaStatus isActive">
                On Sale
              </span>
              <span v-else class="mediaStatus notActive">
                Draft
              </span>
              <span
                v-if="post.pinned"
                class="icn-pin icn-item icn-size_md"
              ></span>
              <span class="mediaStatus viewers">
                <span class="btn-icon icn-item icn-profile icn-size_lg" />
                <span class="likes__counter">{{ post.buyCount || 0 }}</span>
              </span>
            </div>
            <div
              class="statusWrapper bottom"
              v-if="post.media.type !== 'processing'"
            >
              <span class="mediaStatus duration">
                <span>{{ getVideoDuration(post.media.duration) }}</span>
              </span>
              <span
                v-if="post.media.type === 'video'"
                class="mediaStatus duration"
              >
                <span>{{ getVideoResolution }}</span>
              </span>
            </div>
          </template>
          <template v-else>
            <div class="statusWrapper top">
              <span
                v-if="post.pinned"
                class="icn-pin icn-item icn-size_md"
              ></span>
            </div>
            <div
              class="statusWrapper bottom"
              v-if="post.media.type !== 'processing'"
            >
              <span class="mediaStatus duration">
                <span>{{ getVideoDuration(post.media.duration) }}</span>
              </span>
              <span
                v-if="post.media.type === 'video'"
                class="mediaStatus duration"
              >
                <span>{{ getVideoResolution }}</span>
              </span>
            </div>
          </template>
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
    <div class="infoContainer">
      <div class="infoContainer__title">{{ trimmText(post.title, 50) }}</div>
      <button
        :disabled="!isPrivate && post.media.canView"
        v-if="post.price"
        class="btn btn-buy"
        v-tooltip="isPrivate || post.media.canView ? 'Price' : 'Buy'"
        @click.prevent="
          isPrivate ? () => {} : !post.media.canView ? buyMedia(post) : () => {}
        "
      >
        <span class="btn-icon icn-tips icn-item icn-size_lg" />
        {{ post.price ? post.price.toFixed(2) : "" }}
      </button>
      <button v-else class="btn btn-buy">
        Free
      </button>
    </div>
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
    },
    isPrivate: Boolean
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
    },
    getVideoResolution() {
      if (
        !this.$props.post.media.src.width ||
        !this.$props.post.media.src.height
      ) {
        return "";
      }
      return (
        Math.min(
          this.$props.post.media.src.height,
          this.$props.post.media.src.width
        ) + "p"
      );
    },
    isFreeClip() {
      if (this.post.price === 0) {
        return true;
      }
      return false;
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
      if (!this.user && !this.isFreeClip) {
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
    },
    getVideoDuration(duration) {
      const mins = Math.floor(+duration / 60);
      const sec = +duration - mins * 60;
      return `${mins < 10 ? "0" : ""}${mins} : ${sec < 10 ? "0" : ""}${sec}`;
    },
    trimmText(text, len) {
      if (!text.length) {
        return "";
      }
      if (text.length > len) {
        return text.slice(0, len - 3) + "...";
      }
      return text;
    },
    buyMedia(post) {
      if (!this.user) {
        this.$store.dispatch("modal/show", {
          name: "signup"
        });
        return;
      }
      if (post.media.canView) {
        return;
      }
      if (process.env.VUE_APP_NAME === "avn") {
        if (!this.user.isPaymentCardConnected) {
          this.$store.dispatch("global/flashToast", {
            text: "You should add card in payment settings",
            type: "warning"
          });
          this.$router.push("/settings/payments");
          return;
        }

        this.$store.dispatch("modal/show", {
          name: "mediaPayConfirm",
          data: {
            price: post.price,
            paymentType: "message",
            messageId: post.productId
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.mediaStatus {
  padding: 5px 10px;
  border-radius: 1000px;
  &.isActive {
    color: black;
    background-color: white;
  }
  &.notActive {
    color: white;
    background-color: rgba(210, 210, 210, 0.281);
  }
  &.viewers {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
  }
  &.duration {
    padding: 5px 10px;
    background-color: rgba(0, 0, 0, 0.637);
    border-radius: 5px;

    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    &__bottom {
      bottom: 0;
    }
  }
}
.statusWrapper {
  position: absolute;
  width: 100%;
  height: 50px;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  color: rgba(255, 255, 255, 0.644);
  padding: 0 10px;
  &.top {
    top: 0;
  }
  &.bottom {
    bottom: 0;
  }
}
.cameraIcon {
  font-size: 22px;
}
.postLink.postLinkMedia {
  height: 80%;
}
.infoContainer {
  position: absolute;
  width: 100%;
  height: 20%;
  left: 0;
  bottom: 0;
  padding: 10px;
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: space-between;
  &__title {
    font-weight: bold;
  }
}
.btn.btn-buy > span {
  transform: translateY(-6px);
}
.locked-picture {
  .locked {
    transform: scale(1);
  }
}
.contentCenter {
  justify-content: center;
}
.audioPreview {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  img {
    display: block;
    width: 100px;
    height: 100px;
    position: relative;
  }
  audio {
    width: 100%;
  }
}
</style>
