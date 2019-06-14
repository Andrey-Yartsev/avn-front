<template>
  <Modal :onClose="close">
    <template slot="content">
      <div
        class="popup-container popup-addPost"
        :class="{ 'popup-container_hfluid': delayedPosts.length }"
      >
        <div class="content content_relative">
          <div :class="{ 'container-popup': delayedPosts.length }">
            <div
              class="popup-addPost__header hidden-mobile"
              v-if="$mq === 'desktop'"
            >
              New post
              <button
                type="button"
                class="close close_shift-t close_default icn-item icn-size_lg"
                @click="close"
              />
            </div>
            <AddPost
              :initialExpanded="true"
              :close="close"
              type="new"
              where="modal"
            />
            <div class="popup-container-scroll" v-if="delayedPosts.length">
              <VuePerfectScrollbar
                @ps-scroll-y="scrollFunction"
                :settings="{ suppressScrollX: true }"
                class="popup-content-scroll add-post-schedule"
              >
                <div class="feed reset-btr">
                  <div
                    class="title-block title-block_row bg-gradient bg-gradient_pseudo"
                  >
                    <div
                      class="title-block__txt bg-gradient__shadow bg-gradient__shadow_mob"
                    >
                      <span>Scheduled posts</span>
                    </div>
                  </div>
                  <PostCollection :posts="delayedPosts" from="postQueue" />
                </div>
                <div class="loaderWrap loader-content" v-if="loading">
                  <Loader :fullscreen="false" />
                </div>
              </VuePerfectScrollbar>
            </div>
          </div>
        </div>
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
