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
      :class="{
        'clickable-state': showTip,
        active: commentsBtnSelectable && showAddCommentForm
      }"
      @click="() => {}"
      v-if="post.canComment && !post.author.isBlocked"
    >
      <span
        class="btn-icon icn-price icn-item icn-size_lg"
        v-tooltip="'Price'"
      ></span>
      {{ post.commentsCount ? post.commentsCount : "" }}
    </span>
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
      <div class="more-functions__btn" @click="open" />
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
    openModal: {
      type: Function,
      default: () => {}
    },
    showTip: {
      type: Boolean,
      default: false
    },
    showAddCommentForm: {
      type: Boolean,
      default: false
    },
    //Needs for MediumView and LargeView different behaviours
    commentsBtnSelectable: {
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
        this.$store.dispatch("modal/show", { name: "signup" });
        return;
      }
      this.$emit("postLike");
    },
    open() {
      this.opened = true;
      this.$emit("openDropdown");
    },
    hide() {
      this.opened = false;
      this.$emit("hideDropdown");
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
