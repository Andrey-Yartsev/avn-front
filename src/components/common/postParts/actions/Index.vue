<template>
  <div class="actions">
    <span :class="[{ active: post.isFavorite }, 'actions__btn']">
      <span
        @click="postLike"
        class="btn-icon likes icn-item icn-size_lg"
        v-tooltip="post.favoritesCount > 1 ? 'Likes' : 'Like'"
      />
      <span class="likes__counter" @click="showLikesModal">
        {{ post.favoritesCount ? post.favoritesCount : "" }}
      </span>
    </span>
    <span
      class="actions__btn comments-btn"
      :class="{ 'clickable-state': showTips }"
      @click="postShowCommentForm"
      v-if="post.canComment"
    >
      <span
        class="btn-icon comments icn-item icn-size_lg"
        v-tooltip="'Comments'"
      ></span>
      {{ post.commentsCount ? post.commentsCount : "" }}
    </span>
    <template
      v-if="!isOwner(post.author.id) && post.author.canEarn && $root.showTips"
    >
      <span class="actions__btn" @click="toggleTip"
        ><span
          class="btn-icon icn-tips icn-item icn-size_lg"
          v-tooltip="'Tip'"
        ></span
      ></span>
    </template>
    <time class="timestamp">
      <a class="postLink" :href="`/post/${post.id}`" @click.prevent="openModal">
        {{ dateTime }}
      </a>
    </time>
    <div
      :class="['more-functions', { open: opened }]"
      v-click-outside="hide"
      v-if="$mq === 'mobile'"
    >
      <div class="more-functions__overlay" @click="hide"></div>
      <div class="more-functions__btn" @click="open">
        <div class="more-functions__btn-text"></div>
      </div>
      <div class="more-functions__dropdown">
        <Dropdown
          :post="post"
          :from="from"
          :hide="hide"
          :showCopy="showCopy"
          v-on:clickOnDetailsView="$emit('clickOnDetailsView')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Dropdown from "@/components/common/postParts/header/Dropdown";
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
    openModal: {
      type: Function,
      default: () => {}
    },
    showTips: {
      type: Boolean,
      default: false
    },
    from: {
      type: String,
      required: true
    },
    showCopy: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    dateTime() {
      return fromNow(this.post.postedAt);
    }
  },
  methods: {
    postLike() {
      if (!this.user) {
        this.$store.dispatch("modal/show", { name: "login" });
        return;
      }
      this.$emit("postLike");
    },
    postShowCommentForm() {
      if (!this.user) {
        this.$store.dispatch("modal/show", { name: "login" });
        return;
      }
      this.$emit("postShowCommentForm");
    },
    toggleTip() {
      if (!this.user) {
        this.$store.dispatch("modal/show", { name: "login" });
        return;
      }
      this.$emit("toggleTip");
    },
    open() {
      this.opened = true;
      this.$emit("openDropdawn");
    },
    hide() {
      this.opened = false;
      this.$emit("hideDropdawn");
    },
    showLikesModal() {
      this.$store.dispatch("modal/show", {
        name: "postLikes",
        data: {
          postId: this.post.id
        }
      });
    }
  },
  directives: {
    ClickOutside
  }
};
</script>
