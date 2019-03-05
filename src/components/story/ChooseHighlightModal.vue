<template>
  <Modal :onClose="close">
    <template slot="content">
      <div class="popup-container popup-container_hfluid highlights-popup">
        <div class="content">
          <div class="container-popup">
            <div class="popup-title popup-title_sticky-mob">
              <button class="header-return-btn" @click="close"></button>
              <div class="page-title page-title_reset-gl">
                Add to highlights
              </div>
            </div>
            <div class="popup-body">
              <div class="popup-container-scroll">
                <div class="highlights-form">
                  <Loader
                    :fullscreen="false"
                    v-if="loading"
                    class="not-fullscreen transparent small"
                  />
                  <div
                    class="msg-no-content show"
                    v-if="!loading && !posts.length"
                  >
                    <div class="msg-no-content__text">
                      No highlights yet
                    </div>
                  </div>
                  <VuePerfectScrollbar
                    class="list-cover-variation"
                    @ps-scroll-x="scrollFunction"
                  >
                    <div
                      class="highlight-unit"
                      v-for="post in posts"
                      :key="post.id"
                      @click="addNewStoryToCollection(post.id)"
                    >
                      <div class="cover-highlight">
                        <img :src="post.cover" alt="" />
                      </div>
                      <div class="name-highlight">
                        {{ post.title }}
                      </div>
                    </div>
                  </VuePerfectScrollbar>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button type="button" class="close" @click="close"></button>
      </div>
    </template>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import Loader from "@/components/common/Loader";
import User from "@/mixins/user";

export default {
  name: "ChooseHighlights",
  mixins: [User],
  components: {
    Modal,
    VuePerfectScrollbar,
    Loader
  },
  data() {
    return {};
  },
  computed: {
    storyId() {
      return this.$store.state.modal.chooseHighlight.data.storyId;
    },
    loading() {
      return this.$store.state.highlights.loading;
    },
    allDataReceived() {
      return this.$store.state.highlights.allDataReceived;
    },
    posts() {
      return this.$store.state.highlights.posts;
    }
  },
  methods: {
    addNewStoryToCollection(id) {
      this.$store
        .dispatch("highlights/addNewStoryToCollection", {
          collectionId: id,
          storyId: this.storyId
        })
        .then(() => {
          this.$store.dispatch(
            "global/flashToast",
            "Story added to collection",
            {
              root: true
            }
          );

          this.close();
        });
    },
    close() {
      this.$store.dispatch("modal/hide", { name: "chooseHighlight" });
    },
    scrollFunction(e) {
      const { scrollWidth, scrollLeft, offsetWidth } = e.srcElement;
      const scrolledEnought = scrollWidth - (offsetWidth + scrollLeft) < 100;

      if (scrolledEnought && !this.loading && !this.allDataReceived) {
        this.$store.dispatch("highlights/getPosts");
      }
    }
  },
  created() {
    this.$store.dispatch("highlights/resetPageState");
    this.$store.dispatch("highlights/setSource", { source: this.user.id });
    this.$store.dispatch("highlights/getPosts");
  }
};
</script>
