<template>
  <div class="actions">
    <span class="views" :class="[{ active: post.isFavorite }, 'actions__btn']">
      <span
        class="btn-icon looking icn-item icn-size_lg"
        v-tooltip="post.favoritesCount > 1 ? 'Views' : 'View'"
      />
      <span class="likes__counter">
        {{ post.favoritesCount ? post.favoritesCount : "" }}
      </span>
    </span>
    <span
      class="actions__btn comments-btn"
      :class="{
        'clickable-state': showTip,
        active: commentsBtnSelectable && showAddCommentForm
      }"
      v-if="post.canComment && !post.author.isBlocked"
    >
      <span
        class="btn-icon icn-tips icn-item icn-size_lg"
        v-tooltip="'Price'"
      ></span>
      {{ post.commentsCount ? post.commentsCount.toFixed(2) : "" }}
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
    open() {
      this.opened = true;
      this.$emit("openDropdown");
    },
    hide() {
      this.opened = false;
      this.$emit("hideDropdown");
    }
  },
  directives: {
    ClickOutside
  }
};
</script>

<style lang="scss" scoped>
.views {
  pointer-events: none;
}
</style>
