<template>
  <div class="actions">
    <template v-if="isAuthor">
      <span class=" actions__btn comments-btn">
        <span
          class="btn-icon icn-tips icn-item icn-size_md"
          v-tooltip="'Price'"
        ></span>
        {{ post.price ? post.price.toFixed(2) : 0.0 }}
      </span>
      <template v-if="post.media.type !== 'processing'">
        <span class=" actions__btn comments-btn">
          <span
            class="btn-icon icn-item icn-clock icn-size_md"
            v-tooltip="'Duration'"
          ></span>
          {{ getVideoDuration }}
        </span>
        <span
          v-if="post.media.type !== 'audio'"
          class=" actions__btn comments-btn"
        >
          <span
            class="btn-icon icn-item icn-settings icn-size_md"
            v-tooltip="'Quality'"
          ></span>
          {{ getVideoResolution }}
        </span>
      </template>
    </template>
    <template v-else>
      <button
        :disabled="post.media.canView"
        v-if="post.price"
        class="btn btn-buy"
        v-tooltip="post.media.canView ? 'Price' : 'Buy'"
        @click.prevent="buyMedia(post)"
      >
        <span class="btn-icon icn-tips icn-item icn-size_md" />
        {{ post.price ? post.price.toFixed(2) : "" }}
      </button>
      <button v-else class="btn btn-buy">
        Free
      </button>
      <span class="buttonsContainer" v-if="post.media.type !== 'processing'">
        <span class="actions__btn comments-btn duration">
          <span
            class="btn-icon icn-item icn-clock icn-size_md"
            v-tooltip="'Duration'"
          ></span>
          {{ getVideoDuration }}
        </span>
        <span
          v-if="post.media.type !== 'audio'"
          class="actions__btn comments-btn"
        >
          <span
            class="btn-icon icn-item icn-settings icn-size_md"
            v-tooltip="'Quality'"
          ></span>
          {{ getVideoResolution }}
        </span>
      </span>
    </template>
    <span class="actions__btn comments-btn" v-if="isAuthor">
      <span
        class="btn-icon icn-profile icn-item icn-size_lg"
        v-tooltip="'Buyers amount'"
      ></span>
      {{ post.buyCount || 0 }}
    </span>
    <span :class="[{ active: post.isFavorite }, 'actions__btn']">
      <span
        @click="clipLike"
        class="btn-icon likes icn-item icn-size_lg"
        v-tooltip="post.favoritesCount > 1 ? 'Likes' : 'Like'"
      />
      <span class="likes__counter" @click="showLikesModal">
        {{ post.favoritesCount ? post.favoritesCount : "" }}
      </span>
    </span>
    <div
      :class="['more-functions', { open: opened }]"
      v-click-outside="hide"
      v-if="$mq === 'mobile'"
    >
      <div class="more-functions__overlay" @click="hide"></div>
      <div class="more-functions__btn" @click="open" />
      <div class="more-functions__dropdown">
        <Dropdown
          :post="post"
          :from="from"
          :hide="hide"
          v-on:clickOnDetailsView="$emit('clickOnDetailsView')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Dropdown from "@/components/common/profile/media/header/Dropdown";
import ClickOutside from "vue-click-outside";
import { fromNow } from "@/helpers/datetime";
import userMixin from "@/mixins/user";

export default {
  name: "Actions",
  mixins: [userMixin],
  components: {
    Dropdown
  },
  data: () => ({
    opened: false
  }),
  props: {
    post: {
      type: Object,
      isRequired: true
    },
    from: {
      type: String,
      required: true
    },
    isAuthor: {
      type: Boolean
    }
  },
  computed: {
    dateTime() {
      return fromNow(this.post.postedAt);
    },
    getVideoDuration() {
      let duration = this.$props.post.media.duration;
      const mins = Math.floor(+duration / 60);
      const sec = +duration - mins * 60;
      return `${mins < 10 ? "0" : ""}${mins} : ${sec < 10 ? "0" : ""}${sec}`;
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
    }
  },
  methods: {
    open() {
      this.opened = true;
      this.$emit("openDropdown");
    },
    hide() {
      this.opened = false;
      this.$emit("hideDropdown");
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
      this.$emit("openBuyModal");
    },
    clipLike() {
      if (!this.user) {
        this.$store.dispatch("modal/show", {
          name: "login",
          data: {
            callback: () =>
              this.$router.push(`/${this.post.author.username}/media`)
          }
        });
        return;
      }
      if (!this.post.canFavorite) {
        this.$store.dispatch("global/flashToast", {
          text: "You can't mark this clip as a favorite",
          type: "error"
        });
        return;
      }
      const action = this.post.isFavorite ? "unlike" : "like";
      this.$store.dispatch("profile/media/likeMedia", {
        productId: this.post.productId,
        action
      });
    },
    showLikesModal() {
      if (!this.post.canViewFavorite) {
        return;
      }
      this.$store.dispatch("modal/show", {
        name: "clipLikes",
        data: {
          postId: this.post.productId
        }
      });
    }
  },
  directives: {
    ClickOutside
  }
};
</script>

<style lang="scss" scoped>
.hidden-disabled {
  pointer-events: none;
}
.btn-buy {
  & > span {
    transform: translateY(-6px);
    @media (max-width: 575px) {
      transform: translateY(-3px);
    }
  }
}
.buttonsContainer {
  margin-left: 25px;
  display: flex;
  flex-flow: row nowrap;
  @media (max-width: 575px) {
    margin-left: 10px;
  }
  & .duration {
    min-width: 70px;
  }
}
</style>
