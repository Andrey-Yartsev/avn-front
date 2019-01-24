<template>
  <div class="more-functions__dropdown-inside">
    <ul>
      <li
        v-if="$mq === 'mobile'"
        class="more-functions__details"
      >
        <a href="#" @click.prevent="detailView">Details</a>
      </li>
      <li v-if="!isOwner(userId) && isAuth()">
        <button class="report" type="button" @click="reportUser">Report post</button>
      </li>
      <li v-if="copied" >
        <button class="btn-copy-link copied" type="button">Copied!</button>
      </li>
      <li v-else>
        <button class="btn-copy-link" type="button" @click="copyHref">Copy link to post</button>
      </li>
      <template v-if="isOwner(userId)">
        <li>
          <button class="deletePost" type="button" @click="deletePost">Delete post</button>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
import userMixin from "@/mixins/user";

export default {
  name: "PostDropdown",
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
      return this.from;
    },
    isOnPostPage() {
      return this.from === "postPage";
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
    from: {
      type: String,
      required: true
    },
    hide: {
      type: Function,
      required: true
    }
  },
  methods: {
    detailView() {
      this.hide();
      this.$emit("clickOnDetailsView");
    },
    copyHref() {
      this.$copyText(this.href).then(() => {
        this.copied = true;
        setTimeout(() => (this.copied = false), 1000);
      });
    },

    deletePost() {
      this.$store.dispatch(this.actionPrefix + "/deletePost", {
        postId: this.postId
      });

      this.hide();

      if (this.isOnPostPage) {
        return this.$router.push("/");
      }

      window.location.hash = "";
    },

    reportUser() {
      this.hide();

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
