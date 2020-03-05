<template>
  <div class="more-functions__dropdown-inside">
    <ul class="more-functions__list">
      <li
        v-if="$mq === 'mobile'"
        class="more-functions__details more-functions__item"
      >
        <button @click.prevent="detailView" class="more-functions__link">
          <span class="more-functions__option">Details</span>
        </button>
      </li>
      <li v-if="!isOwner(userId) && isAuth()" class="more-functions__item">
        <button
          class="report more-functions__link"
          type="button"
          @click="reportUser"
        >
          <span class="more-functions__option icn-item">Report post</span>
        </button>
      </li>
      <li
        v-if="!isOwner(userId) && isAuth() && !isRepost && !isContentHidden"
        class="more-functions__item"
      >
        <button class="more-functions__link" type="button" @click="repost">
          <span class="more-functions__option icn-item">Repost</span>
        </button>
      </li>
      <template v-if="showCopy">
        <li v-if="copied" class="more-functions__item">
          <button
            class="btn-copy-link copied more-functions__link"
            type="button"
          >
            <span class="more-functions__option">Copied!</span>
          </button>
        </li>
        <li class="more-functions__item" v-else>
          <button
            class="btn-copy-link more-functions__link"
            type="button"
            @click="copyHref"
          >
            <span class="more-functions__option">Copy link to post</span>
          </button>
        </li>
      </template>
      <li
        v-if="isOwner(userId) && isAuth() && !isRepost"
        class="more-functions__item"
      >
        <a
          class="edit more-functions__link"
          type="button"
          :href="'/post/edit/' + post.id"
          @click.prevent="editPost"
        >
          <span class="more-functions__option">Edit post</span>
        </a>
      </li>
      <template v-if="isOwner(userId)">
        <li
          class="more-functions__item"
          v-if="actionPrefix === 'profile/home' && canPin && !post.isPinned"
        >
          <button class="more-functions__link" type="button" @click="pinAction">
            <span class="more-functions__option">Pin post</span>
          </button>
        </li>
        <li
          class="more-functions__item"
          v-if="actionPrefix === 'profile/home' && post.isPinned"
        >
          <button
            class="more-functions__link"
            type="button"
            @click="unpinAction"
          >
            <span class="more-functions__option">Pinned. Unpin post</span>
          </button>
        </li>
        <li class="more-functions__item">
          <button
            class="deletePost more-functions__link"
            type="button"
            @click="deletePost"
          >
            <span class="more-functions__option">Delete post</span>
          </button>
        </li>
      </template>
      <li v-if="!isOwner(userId) && isAuth()" class="more-functions__item">
        <button
          class="edit more-functions__link"
          type="button"
          @click="markSpam"
        >
          <span class="more-functions__option">Mark as spam</span>
        </button>
      </li>
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
      const { protocol, port, hostname } = window.location;
      const postId = this.post.innerPost
        ? this.post.innerPost.id
        : this.post.id;
      const author = this.post.innerPost
        ? this.post.innerPost.author.username
        : this.post.author.username;
      return (
        `${protocol}//${hostname}` +
        (port ? ":" + port : "") +
        `/post/${author}/${postId}`
      );
    },
    actionPrefix() {
      return this.from;
    },
    isOnPostPage() {
      return this.from === "postPage";
    },
    postId() {
      return this.post.id;
    },
    userId() {
      return this.post.author.id;
    },
    pinCount() {
      return this.$store.state.profile.home.postPinCount;
    },
    canPin() {
      return this.pinCount < 3;
    },
    isRepost() {
      return !!this.$props.post.innerPost;
    },
    isContentHidden() {
      return this.$props.post.media.length && !this.$props.post.canViewMedia;
    }
  },
  props: {
    post: {
      type: Object,
      required: true
    },
    from: {
      type: String,
      required: true
    },
    hide: {
      type: Function,
      required: true
    },
    showCopy: {
      type: Boolean,
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
    pinAction() {
      this.$store.dispatch("profile/home/pin", this.postId);
      this.hide();
    },
    unpinAction() {
      this.$store.dispatch("profile/home/unpin", this.postId);
      this.hide();
    },
    editPost() {
      this.hide();

      if (this.isOnPostPage) {
        this.$router.push("/post/edit/" + this.postId);
      } else {
        this.$store.dispatch("modal/show", {
          name: "editPost",
          data: {
            postId: this.postId
          }
        });
      }
    },
    reportUser() {
      this.hide();

      this.$store.dispatch("modal/show", {
        name: "postReport",
        data: {
          postId: this.postId
        }
      });
    },
    repost() {
      this.hide();
      this.$store.dispatch("profile/home/repost", this.postId);
    },
    markSpam() {
      this.$store.dispatch("home/spamPost", this.$props.post.author.id);

      this.hide();

      if (this.isOnPostPage) {
        return this.$router.push("/");
      }

      window.location.hash = "";
    }
  }
};
</script>
