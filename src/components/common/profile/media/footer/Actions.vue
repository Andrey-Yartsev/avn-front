<template>
  <div class="actions">
    <span v-if="isAuthor" class=" actions__btn comments-btn">
      <span
        class="btn-icon icn-tips icn-item icn-size_lg"
        v-tooltip="'Price'"
      ></span>
      {{ post.price ? post.price.toFixed(2) : 0.0 }}
    </span>
    <template v-else>
      <button
        :disabled="post.media.canView"
        v-if="post.price"
        class="btn btn-buy"
        v-tooltip="post.media.canView ? 'Price' : 'Buy'"
        @click.prevent="buyMedia(post)"
      >
        <span class="btn-icon icn-tips icn-item icn-size_lg" />
        {{ post.price ? post.price.toFixed(2) : "" }}
      </button>
      <button v-else class="btn btn-buy">
        Free
      </button>
    </template>
    <span class="actions__btn comments-btn" v-if="isAuthor">
      <span
        class="btn-icon icn-profile icn-item icn-size_lg"
        v-tooltip="'Buyers amount'"
      ></span>
      {{ post.buyCount || 0 }}
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
