<template>
  <Modal :onClose="close" :path="path" :extraClassName="extraClassName">
    <template slot="content">
      <div class="popup-container post post-popup">
        <div class="previous" @click="index -= 1" v-if="index > 0"></div>
        <div class="content">
          <div class="postPageWrapper">
            <PostLargeView
              v-if="post"
              :post="post"
              :from="from"
              v-on:addExtraClassName="addExtraClassName"
            />
          </div>
        </div>
        <button type="button" class="close" @click="close"></button>
        <div class="next" @click="next" v-if="index + 1 < length"></div>
      </div>
    </template>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import PostLargeView from "@/components/post/LargeView";
import ModalRouterGoto from "@/mixins/modalRouter/goto";

export default {
  name: "PostModal",
  mixins: [ModalRouterGoto],
  data() {
    return {
      index: undefined,
      extraClassName: "lightbox-post"
    };
  },
  computed: {
    from() {
      return this.$store.state.modalRouter.params.from;
    },
    postId() {
      return parseInt(this.$store.state.modalRouter.params.postId);
    },
    post() {
      return this.postFromList || this.postFromServer;
    },
    postFromList() {
      return this.posts.length && this.index !== undefined
        ? this.posts[this.index]
        : null;
    },
    postFromServer() {
      return this.$store.state.postPage.posts[0];
    },
    length() {
      return this.posts.length;
    },
    path() {
      return `post/${this.postId}`;
    },
    postsState() {
      if (this.from === "profile/home") {
        return this.$store.state.profile.home;
      } else if (this.from === "home") {
        return this.$store.state.home;
      } else if (this.from === "explore") {
        return this.$store.state.explore;
      } else if (this.from === "search/page") {
        return this.$store.state.search.page;
      }
      throw new Error(`from "${this.from}" does not exists`);
    },
    posts() {
      return this.postsState.posts;
    }
  },
  components: {
    Modal,
    PostLargeView
  },
  methods: {
    addExtraClassName(className) {
      this.extraClassName = className;
    },
    scroll() {
      this.$scrollTo(`[data-id="${this.post.id}"]`);
    },
    next() {
      if (this.index >= this.postsState.posts.length - 3) {
        if (!this.postsState.allDataReceived && !this.postsState.loading) {
          this.$store.dispatch(`${this.from}/getPosts`);
        }
      }
      this.index++;
    },
    setIndex() {
      if (this.index) {
        return;
      }

      const post = this.posts.find(({ id }) => {
        return id === this.postId;
      });

      if (post) {
        this.index = this.posts.indexOf(post);
      }
    }
  },
  watch: {
    index() {
      this.$store.dispatch(
        "modalRouter/updatePath",
        `post/${this.post.id}/${this.from}`
      );
    }
  },
  created() {
    if (!this.posts.length) {
      this.$store.dispatch("postPage/getPost", { postId: this.postId });
      return;
    }

    this.setIndex();
  }
};
</script>
