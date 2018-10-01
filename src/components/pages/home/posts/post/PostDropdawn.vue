<template>
    <div class="dropdown-menu">
        <button class="report" type="button" @click="reportUser">Report post</button>
        <button v-if="copied" class="btn-copy-link copied" type="button">Copied!</button>
        <button v-else  class="btn-copy-link" type="button" @click="copyHref">Copy link to post</button>
        <template v-if="isOwner(userId)">
          <button class="deletePost" type="button" @click="deletePost">Delete post</button>
        </template>
        <PostReportModal v-if="showReportModal" />
    </div>
</template>

<script>
import userMixin from "@/mixins/user";
import { execCopy } from "@/helpers/page";
import PostReportModal from "./PostReportModal";

export default {
  name: "PostDropdawn",
  mixins: [userMixin],
  data: () => ({
    copied: false,
    showReportModal: false
  }),
  computed: {
    href() {
      const { protocol, hostname } = window.location;
      return `${protocol}//${hostname}/post/${this.postId}`;
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
    }
  },
  components: {
    PostReportModal
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
      this.showReportModal = true;
    }
  }
};
</script>
