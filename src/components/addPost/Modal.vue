<template>
  <Modal :onClose="close">
    <template slot="content">
      <div
        class="popup-container popup-addPost"
        :class="{ 'popup-container_hfluid': delayedPosts.length }"
      >
        <div class="previous hidden"></div>
        <div class="content">
          <div :class="{ 'container-popup': delayedPosts.length }">
            <div
              class="popup-addPost__header hidden-mobile"
              v-if="$mq === 'desktop'"
            >
              New post
            </div>
            <AddPost :initialExpanded="true" :close="close" type="new" />
            <template v-if="false">
              <div class="popup-container-scroll" v-if="delayedPosts.length">
                <VuePerfectScrollbar
                  :settings="{ suppressScrollX: true }"
                  class="popup-content-scroll add-post-schedule"
                >
                  <div class="feed reset-btr">
                    <PostCollection :posts="delayedPosts" from="postQueue" />
                  </div>
                  <div
                    class="loaderWrap loader-content"
                    v-if="infinityScrollLoading"
                  >
                    <Loader :fullscreen="false" />
                  </div>
                </VuePerfectScrollbar>
              </div>
            </template>
          </div>
        </div>
        <button type="button" class="close" />
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
import VuePerfectScrollbar from "vue-perfect-scrollbar";

export default {
  name: "AddPostModal",
  mixins: [InfinityScrollMixin],
  components: {
    Modal,
    AddPost,
    PostCollection,
    VuePerfectScrollbar
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
