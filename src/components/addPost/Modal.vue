<template>
  <Modal :onClose="close">
    <template slot="content">
      <div class="popup-container popup-addPost">
        <div class="previous hidden"></div>
        <div class="popup-addPost__header">New post</div>
        <div class="content">
          <AddPost :initialExpanded="true" :close="close" type="new" />
        </div>
        <template v-if="false">
          <div class="feed reset-btr">
            <PostCollection :posts="delayedPosts" from="postQueue" />
          </div>
          <div class="loaderWrap loader-content" v-if="infinityScrollLoading">
            <Loader :fullscreen="false" />
          </div>
        </template>
        <button type="button" class="close" @click="close"></button>
        <div class="next hidden"></div>
      </div>
    </template>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import AddPost from "./Index";
import PostCollection from "@/components/common/postCollection/Index";
import InfinityScrollMixin from "@/mixins/infinityScroll";

export default {
  name: "AddPostModal",
  mixins: [InfinityScrollMixin],
  components: {
    Modal,
    AddPost,
    PostCollection
  },
  methods: {
    close(e) {
      e.preventDefault();
      this.$store.dispatch("modal/hide", { name: "addPost" });
    },
    infinityScrollGetDataMethod() {
      this.$store.dispatch("postQueue/getPosts");
    }
  },
  computed: {
    delayedPosts() {
      return this.$store.state.postQueue.posts;
    },
    store() {
      // uses into InfinityScrollMixin
      return this.$store.state.postQueue;
    }
  },
  created() {
    this.$store.commit("postQueue/reset");
    this.$store.dispatch("postQueue/getPosts");
  }
};
</script>
