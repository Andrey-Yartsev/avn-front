<template>
  <Modal :onClose="close" :path="path" :extraClassName="extraClassName">
    <template slot="content">
      <div class="popup-container post post-popup">
        <div
          class="btn-direction btn-direction_tb-sides btn-direction_prev btn-direction_prev-up icn-item"
          @click="index -= 1"
          v-if="index > 0"
        ></div>
        <div
          class="content"
          :class="{ 'content_column-mob': $mq === 'mobile' }"
        >
          <div class="postPageWrapper postPageWrapper_in-popup">
            <PostLargeView
              v-if="post"
              :post="post"
              :from="backFrom || from"
              v-on:addExtraClassName="addExtraClassName"
            />
          </div>
        </div>
        <button
          type="button"
          class="close close_default icn-item icn-size_lg"
          @click="close"
        />
        <div
          class="btn-direction btn-direction_tb-sides btn-direction_next btn-direction_next-down icn-item"
          @click="next"
          v-if="index + 1 < length"
        ></div>
      </div>
    </template>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import PostLargeView from "@/components/post/view/LargeView";
import ModalRouterGoto from "@/mixins/modalRouter/goto";

export default {
  name: "PostModal",
  mixins: [ModalRouterGoto],
  data() {
    return {
      index: undefined,
      extraClassName: "lightbox-post",
      backFrom: undefined,
      preloadedImageIndexes: {}
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
      return this.posts[this.index];
    },
    length() {
      return this.posts.length;
    },
    path() {
      return `post/${this.postId}`;
    },
    postsState() {
      if (this.backFrom) {
        return this.$store.state.postPage;
      } else if (this.from === "profile/home") {
        return this.$store.state.profile.home;
      } else if (this.from === "home") {
        return this.$store.state.home;
      } else if (this.from === "explore") {
        return this.$store.state.explore;
      } else if (this.from === "search/page") {
        return this.$store.state.search.page;
      } else if (this.from === "favPosts") {
        return this.$store.state.favPosts;
      } else if (this.from === "notif") {
        return this.$store.state.notif.postModal;
      }
      throw new Error(`from "${this.from}" does not exists`);
    },
    posts() {
      return this.postsState.posts;
    },
    postNotFetchedYet() {
      if (!this.posts.length) return true;
      const existedPost = this.posts.find(item => item.id === this.postId);
      return !existedPost;
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
          this.$store.dispatch(`${this.from}/getPosts`).then(() => {
            this.preloadNextImages();
          });
        }
      }
      this.index++;
      this.preloadNextImages();
    },
    preloadNextImages() {
      this.preloadNextImage(1);
      this.preloadNextImage(2);
      this.preloadNextImage(3);
    },
    preloadNextImage(indexOffset) {
      const i = this.index + indexOffset;
      if (!this.postsState.posts[i]) {
        return;
      }
      const post = this.postsState.posts[i];

      //sometimes post.media[0].src may be null
      if (!post.media || !post.media.length || !post.media[0].src) {
        return;
      }
      if (this.preloadedImageIndexes[i]) {
        return;
      }
      this.preloadedImageIndexes[i] = true;
      const url = post.media[0].src.source;

      const img = new Image();
      img.src = url;
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
      if (this.backFrom === "postPage" || !this.post) return;
      this.$store.dispatch(
        "modalRouter/updatePath",
        `post/${this.post.id}/${this.from}`
      );
    }
  },
  created() {
    if (!this.length || this.postNotFetchedYet) {
      this.backFrom = "postPage";
      this.$store.commit("postPage/resetPageState");

      this.$store
        .dispatch("postPage/getPost", { postId: this.postId })
        .then(() => {
          this.index = 0;
        })
        .catch(err => {
          this.$store.dispatch("global/setError", {
            title: err.message,
            message: "Post does not exists"
          });
          this.close();
        });

      return;
    }

    this.setIndex();
    this.preloadNextImages();
  }
};
</script>
