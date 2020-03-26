<template>
  <div class="more-functions__dropdown-inside">
    <ul class="more-functions__list">
      <li class="more-functions__item">
        <button class="more-functions__link" type="button" @click="repost">
          <span class="more-functions__option icn-item">Repost</span>
        </button>
      </li>
      <li class="more-functions__item">
        <button
          class="more-functions__link"
          type="button"
          @click="reposWithComment"
        >
          <span class="more-functions__option icn-item"
            >Repost with comment</span
          >
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
  computed: {
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
    }
  },
  methods: {
    repost() {
      this.hide();
      this.$store.dispatch("profile/home/repost", { postId: this.postId });
    },
    reposWithComment() {
      this.hide();
      this.$store.dispatch("modal/show", {
        name: "postRepostComment",
        data: {
          postId: this.postId
        }
      });
    }
  }
};
</script>
