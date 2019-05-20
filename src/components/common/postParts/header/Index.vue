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
    <router-link class="name" :to="'/' + user.username">{{
      user.name
    }}</router-link>
    <template v-if="user.isVerified">
      <span class="verified-user"></span>
    </template>
    <span class="user-login">
      <router-link :to="'/' + user.username">{{ user.username }}</router-link>
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
    }
  },
  mounted() {
    this.popupItem = this.$el.querySelector(".more-functions");
  },
  directives: {
    ClickOutside
  }
};
</script>
