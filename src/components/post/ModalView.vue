<template>
  <Modal :onClose="close"> 
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
    }
  },
  data: () => ({
    postId: undefined,
    dataSrc: undefined,
    backUrl: undefined,
    index: 0
  }),
  components: {
    Modal,
    PostLargeView
  },
  methods: {
    close() {
      window.history.replaceState({}, "post", this.backUrl);

      this.$store.dispatch("modal/hide", {
        name: "post"
      });
    },
    scroll() {
      this.$scrollTo(`[data-id="${this.post.id}"]`);
    }
  },
  created() {
    const { postId, from, backUrl } = this.$store.state.modal.post.data;
    if (from === "profile/home") {
      this.dataSrc = this.$store.state.profile.home;
    }
    if (from === "home") {
      this.dataSrc = this.$store.state.home;
    }

    const post = this.dataSrc.posts.filter(({ id }) => id === postId)[0];

    this.from = from;
    this.postId = postId;
    this.backUrl = backUrl;
    this.index = this.dataSrc.posts.indexOf(post);
    window.history.replaceState({}, "post", `/post/${this.postId}`);
  },
  watch: {
    index: function() {
      this.scroll();
    }
  }
};
</script>
