<template>
  <div class="post-header" :class="{ wrap: isReposted }">
    <div v-if="isReposted" class="retweetMark">
      <span class="btn-icon icn-item icn-size_md icn-retweet" />
      Reposted
    </div>
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
    <template v-if="postUser.isVerified">
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
    <template v-if="!isReposted">
      <div :class="['more-functions', { open: opened }]" v-click-outside="hide">
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
    </template>
    <span v-else @click="copyHref" class="copyLink">
      <p v-if="copied">Copied</p>
      <span v-else class="icn-item icon-link icn-size_lg" />
    </span>
  </div>
</template>

<script>
import Dropdown from "@/components/post/parts/header/Dropdown";
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
    opened: false,
    copied: false
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
    isReposted: Boolean
  },
  computed: {
    postId() {
      return this.post.id;
    },
    postUser() {
      return this.post.author;
    },
    href() {
      const { protocol, port, hostname } = window.location;
      return (
        `${protocol}//${hostname}` +
        (port ? ":" + port : "") +
        `/post/${this.post.author.username}/${this.postId}`
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
    showBubble() {
      Bubble.open({
        a: this.$refs.name,
        username: this.postUser.username
      });
    },
    hideBubble() {
      Bubble.hide();
    },
    copyHref() {
      this.$copyText(this.href).then(() => {
        this.copied = true;
        setTimeout(() => (this.copied = false), 1000);
      });
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
.copyLink {
  font-size: 14px;
  margin-left: auto;
  margin-right: -30px;
  color: inherit;
  opacity: 0.5;
  cursor: pointer;
  transition: opacity 0.3s ease;
  &:hover {
    opacity: 1;
  }
}
.retweetMark {
  width: 100%;
  color: inherit;
  padding: 0 10px 5px 8px;
  opacity: 0.5;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  .retweetMark__icon {
    margin-right: 5px;
  }
}
</style>
