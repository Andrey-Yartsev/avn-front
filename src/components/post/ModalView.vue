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
  computed: {
    post() {
      return this.dataSrc.posts[this.index];
    },
    length() {
      return this.dataSrc.posts.length;
    },
    path() {
      return `post/${this.postId}`;
    }
  },
  data: () => ({
    postId: undefined,
    dataSrc: undefined,
    index: 0
  }),
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
  created() {
    let { postId, from } = this.$store.state.modalRouter.params;
    postId = parseInt(postId);

    if (from === "profile") {
      this.dataSrc = this.$store.state.profile.home;
    } else {
      this.dataSrc = this.$store.state.home;
    }

    const post = this.dataSrc.posts.find(({ id }) => {
      return id === postId;
    });

    this.from = from;
    this.postId = postId;
    this.index = this.dataSrc.posts.indexOf(post);
  },
  watch: {
    index: function() {
      this.scroll();
    }
  }
};
</script>
