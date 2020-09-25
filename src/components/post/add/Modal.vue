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
              :isStashed="isStashed"
              type="new"
              where="modal"
              ref="addPost"
            />
            <div class="popup-container-scroll" v-if="delayedPosts.length">
              <perfect-scrollbar
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
                <div class="loader-infinity" v-if="loading">
                  <Loader
                    :fullscreen="false"
                    :inline="true"
                    text=""
                    :small="true"
                  />
                </div>
              </perfect-scrollbar>
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
import PostCollection from "@/components/post/collection/Index";
import Loader from "@/components/common/Loader";

export default {
  name: "AddPostModal",
  components: {
    Modal,
    AddPost,
    PostCollection,
    Loader
  },
  methods: {
    close() {
      if (this.$refs.addPost.uploadInProgress) {
        this.$store.dispatch("modal/show", {
          name: "confirm",
          data: {
            title: "Upload in progress",
            success: () => {
              this.$store.dispatch("modal/hide", { name: "addPost" });
            }
          }
        });
        return;
      }
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
    },
    isStashed() {
      return this.$store.state.modal.addPost.data.isStashed;
    }
  },
  created() {
    this.$store.commit("postQueue/reset");
    this.$store.dispatch("postQueue/getPosts");
  }
};
</script>
