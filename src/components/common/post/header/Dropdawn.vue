<template>
    <div class="dropdown-menu">
       <template v-if="!isOwner(userId) && isAuth()">
          <button class="report" type="button" @click="reportUser">Report post</button>
        </template>
        <button v-if="copied" class="btn-copy-link copied" type="button">Copied!</button>
        <button v-else  class="btn-copy-link" type="button" @click="copyHref">Copy link to post</button>
        <template v-if="isOwner(userId)">
          <button class="deletePost" type="button" @click="deletePost">Delete post</button>
        </template>
    </div>
</template>

<script>
import userMixin from "@/mixins/user";
import { execCopy } from "@/helpers/page";

export default {
  name: "PostDropdawn",
  mixins: [userMixin],
  data: () => ({
    copied: false
  }),
  computed: {
    href() {
      const { protocol, hostname } = window.location;
      return `${protocol}//${hostname}/post/${this.postId}`;
    },
    actionPrefix() {
      return this.isProfilePost ? "profile/home" : "home";
    }
  },
  props: {
    userId: {
      type: Number,
      required: true
    },
    postId: {
      type: Number,
      required: true
    },
    isProfilePost: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    copyHref() {
      execCopy(this.href);
      this.copied = true;
      setTimeout(() => (this.copied = false), 1000);
    },

    deletePost() {
      this.$store.dispatch("home/deletePost", { postId: this.postId });
    },

    reportUser() {
      this.$store.dispatch("modal/show", {
        name: "postReport",
        data: {
          postId: this.postId
        }
      });
    }
  }
};
</script>
