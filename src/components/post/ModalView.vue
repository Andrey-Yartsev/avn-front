<template>
  <Modal :onClose="close" :path="path">
    <template slot="content">
      <div class="popup-container post post-popup">
        <div class="previous" @click="index -= 1" v-if="index > 0"></div>
        <div class="content">
          <PostLargeView :post="post" :from="from" />
        </div>
        <button type="button" class="close" @click="close"></button>
        <div class="next" @click="index += 1" v-if="index + 1 < length"></div>
      </div>
    </template>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import PostLargeView from "@/components/post/LargeView";

export default {
  name: "PostModal",
  data() {
    return {
      index: null
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
    posts() {
      if (this.from === "profile") {
        return this.$store.state.profile.home.posts;
      } else if (this.from === "home") {
        return this.$store.state.home.posts;
      } else if (this.from === "explore") {
        return this.$store.state.explore.posts;
      } else if (this.from === "search") {
        return this.$store.state.search.page.items;
      }
      throw new Error(`from "${this.from}" does not exists`);
    }
  },
  components: {
    Modal,
    PostLargeView
  },
  methods: {
    close() {
      window.location.hash = "";
    },
    scroll() {
      this.$scrollTo(`[data-id="${this.post.id}"]`);
    }
  },
  watch: {
    index: function() {
      this.scroll();
    }
  },
  created() {
    const post = this.posts.find(({ id }) => {
      return id === this.postId;
    });
    this.index = this.posts.indexOf(post);
  }
};
</script>
