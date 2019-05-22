<template>
  <div class="post-header">
    <router-link
      class="avatar avatar_gap-r-sm avatar_sm"
      :to="'/' + user.username"
    >
      <span class="avatar__img">
        <img v-if="user.avatar" :src="user.avatar" />
      </span>
    </router-link>
    <a
      class="name"
      :href="'/' + user.username"
      ref="name"
      @click.prevent="$router.push('/' + user.username)"
      @mouseover="showBubble"
      @mouseout="hideBubble"
      >{{ user.name }}</a
    >
    <template v-if="user.isVerified">
      <span class="verified-user"></span>
    </template>
    <span class="user-login">
      <a
        :href="'/' + user.username"
        @click.prevent="$router.push('/' + user.username)"
        @mouseover="showBubble"
        @mouseout="hideBubble"
        >{{ user.username }}</a
      >
    </span>
    <span class="follow-link hidden">Follow</span>
    <time class="timestamp" v-if="datetime">
      {{ datetime }}
    </time>
    <span v-if="post.isPinned" class="post-pinned"></span>
    <div :class="['more-functions', { open: opened }]" v-click-outside="hide">
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
import Dropdown from "./Dropdown";
import ClickOutside from "vue-click-outside";
import Bubble from "@/helpers/userBubble";

export default {
  name: "Header",
  components: {
    Dropdown
  },
  data: () => ({
    opened: false
  }),
  props: {
    datetime: {
      type: String,
      default: undefined
    },
    post: {
      type: Object,
      required: true
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
    postId() {
      return this.post.id;
    },
    user() {
      return this.post.author;
    }
  },
  methods: {
    open() {
      this.opened = true;
      this.$emit("openDropdawn");
    },
    hide() {
      this.opened = false;
      this.$emit("hideDropdawn");
    },
    showBubble() {
      Bubble.open({
        a: this.$refs.name,
        username: this.user.username
      });
    },
    hideBubble() {
      Bubble.hide();
    }
  },
  mounted() {
    this.popupItem = this.$el.querySelector(".more-functions");
  },
  beforeDestroy() {
    Bubble._hide();
  },
  directives: {
    ClickOutside
  }
};
</script>
