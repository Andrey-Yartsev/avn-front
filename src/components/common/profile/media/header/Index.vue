<template>
  <div class="post-header">
    <router-link
      class="avatar avatar_gap-r-sm avatar_sm"
      :to="'/' + postUser.username"
      :class="{ 'online-state': isOnline(postUser.id) }"
    >
      <span class="avatar__img">
        <img v-if="postUser.avatar" :src="postUser.avatar" />
      </span>
    </router-link>
    <a
      class="name"
      :href="'/' + postUser.username"
      ref="name"
      @click.prevent="$router.push('/' + postUser.username).catch(() => {})"
      @mouseover="showBubble"
      @mouseout="hideBubble"
      >{{ postUser.name }}</a
    >
    <template v-if="postUser.isActive">
      <span class="verified-user icn-item"></span>
    </template>
    <span class="user-login">
      <a
        :href="'/' + postUser.username"
        @click.prevent="$router.push('/' + postUser.username)"
        @mouseover="showBubble"
        @mouseout="hideBubble"
        >{{ postUser.username }}</a
      >
    </span>
    <span class="follow-link hidden">Follow</span>
    <span class="follow-link hidden">Follow</span>
    <time class="timestamp" v-if="datetime">
      {{ datetime }}
    </time>
    <span
      v-if="post.isPinned && isAuth()"
      class="icn-item icn-pinned icn-size_lg"
    />
    <span v-if="post.active" class="isActive icn-item verified-user" />
    <div :class="['more-functions', { open: opened }]" v-click-outside="hide">
      <div class="more-functions__overlay" @click="hide"></div>
      <div class="more-functions__btn" @click="open" v-if="isAuthor" />
      <div class="more-functions__dropdown">
        <Dropdown
          v-if="isAuthor"
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
import Bubble from "@/helpers/userBubble";
import User from "@/mixins/user";

export default {
  name: "Header",
  mixins: [User],
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
    },
    isAuthor: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    postId() {
      return this.post.id;
    },
    postUser() {
      return this.post.author;
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
    showBubble() {
      Bubble.open({
        a: this.$refs.name,
        username: this.postUser.username
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

<style lang="scss" scoped>
.isActive {
  position: absolute;
  right: 40px;
  top: 20px;
}
</style>