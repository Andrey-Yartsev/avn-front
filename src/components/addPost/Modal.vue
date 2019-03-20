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
            <div class="popup-container-scroll" v-if="delayedPosts.length">
              <VuePerfectScrollbar
                @ps-scroll-y="scrollFunction"
                :settings="{ suppressScrollX: true }"
                class="popup-content-scroll add-post-schedule"
              >
                <div class="feed reset-btr">
                  <PostCollection :posts="delayedPosts" from="postQueue" />
                </div>
                <div class="loaderWrap loader-content" v-if="loading">
                  <Loader :fullscreen="false" />
                </div>
              </VuePerfectScrollbar>
            </div>
          </div>
        </div>
        <button type="button" class="close" @click="close" />
        <div class="next hidden"></div>
      </div>
    </template>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import AddPost from "./Index";
import PostCollection from "@/components/common/postCollection/Index";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import Loader from "@/components/common/Loader";

export default {
  name: "AddPostModal",
  components: {
    Modal,
    AddPost,
    PostCollection,
    VuePerfectScrollbar,
    Loader
  },
  methods: {
    close(e) {
      e.preventDefault();
      this.$store.dispatch("modal/hide", { name: "addPost" });
    },
    infinityScrollGetDataMethod() {
      this.$store.dispatch("postQueue/getPosts");
    },
    scrollFunction(e) {
      const { scrollHeight, scrollTop, offsetHeight } = e.srcElement;
      const scrolledEnought = scrollHeight - (offsetHeight + scrollTop) < 100;

      if (scrolledEnought && !this.loading && !this.allDataReceived) {
        this.$store.dispatch("postQueue/getPosts");
      }
    }
  },
  computed: {
    delayedPosts() {
      return this.$store.state.postQueue.posts;
    },
    loading() {
      return this.$store.state.postQueue.loading;
    },
    allDataReceived() {
      return this.$store.state.postQueue.allDataReceived;
    }
  },
  created() {
    this.$store.commit("postQueue/reset");
    this.$store.dispatch("postQueue/getPosts");
  }
};
</script>
