<template>
  <Modal :onClose="close">
    <template slot="content">
      <div class="popup-container popup-container_hfluid highlights-popup">
        <div class="content">
          <div class="container-popup">
            <div class="popup-title popup-title_sticky-mob">
              <button
                class="header-return-btn go-back go-back_arrow header-return-btn_icn-abs"
                @click="close"
                v-if="$mq === 'mobile'"
              />
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
                    class="not-fullscreen small"
                  />
                  <div
                    class="msg-no-content show"
                    v-if="!loading && !posts.length"
                  >
                    <div class="msg-no-content__text">
                      No highlights yet
                    </div>
                    <a @click="createHL" class="story btn-add-story">
                      <div
                        class="avatar avatar_lg-tab avatar_gap-r-md"
                        @click.prevent="addNew"
                      >
                        <div class="round-add icn-item"></div>
                      </div>
                      <div class="story-info">
                        <div class="story-header">
                          <div class="name">
                            Add new
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                  <perfect-scrollbar
                    class="list-cover-variation"
                    @ps-scroll-x="scrollFunction"
                  >
                    <div
                      class="highlight-unit"
                      v-for="post in posts"
                      :key="post.id"
                      @click="addNewStoryToCollection(post.id)"
                    >
                      <div class="cover-highlight icn-item">
                        <img :src="post.cover" alt="" />
                      </div>
                      <div class="name-highlight">
                        {{ post.title }}
                      </div>
                    </div>
                  </perfect-scrollbar>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button
          type="button"
          class="close close_shift-t close_shift-r close_default icn-item icn-size_lg"
          @click="close"
        />
      </div>
    </template>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import Loader from "@/components/common/Loader";
import User from "@/mixins/user";

export default {
  name: "ChooseHighlights",
  mixins: [User],
  components: {
    Modal,
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
    createHL() {
      this.$store.dispatch("modal/show", {
        name: "createHighlights"
      });
    },
    addNewStoryToCollection(id) {
      this.$store
        .dispatch("highlights/addNewStoryToCollection", {
          collectionId: id,
          storyId: this.storyId
        })
        .then(() => {
          this.$store.dispatch(
            "global/flashToast",
            { text: "Story added to collection" },
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
