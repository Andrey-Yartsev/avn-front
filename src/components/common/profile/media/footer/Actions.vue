<template>
  <div class="actions">
    <span
      class="hidden-disabled"
      :class="[{ active: post.isFavorite }, 'actions__btn']"
    >
      <span
        class="btn-icon looking icn-item icn-size_lg"
        v-tooltip="post.views > 1 ? 'Views' : 'View'"
      />
      <span class="likes__counter">
        {{ post.views || 0 }}
      </span>
    </span>
    <span
      v-if="isAuthor || post.media.canView"
      class="hidden-disabled actions__btn comments-btn"
    >
      <span
        class="btn-icon icn-tips icn-item icn-size_lg"
        v-tooltip="'Price'"
      ></span>
      {{ post.price ? post.price.toFixed(2) : 0.0 }}
    </span>
    <button
      v-else
      class="btn btn-buy"
      v-tooltip="'Buy'"
      @click.prevent="$emit('openBuyModal')"
    >
      <span class="btn-icon icn-tips icn-item icn-size_lg" />
      {{ post.price ? post.price.toFixed(2) : "" }}
    </button>
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
.hidden-disabled {
  pointer-events: none;
}
.btn-buy {
  & > span {
    transform: translateY(-6px);
  }
}
</style>
