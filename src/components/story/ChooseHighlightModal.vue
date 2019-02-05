<template>
  <Modal :onClose="close">
    <template slot="content">
      <div class="popup-container popup-container_hfluid highlights-popup">
        <div class="content">
          <div class="container-popup">
            <div class="popup-title popup-title_sticky-mob">
              <button class="header-return-btn"></button>
              <div class="page-title page-title_reset-gl">
                Add to highlights
              </div>
            </div>
            <div class="popup-body">
              <div class="popup-container-scroll">
                <div class="highlights-form">
                  <div class="list-cover-variation">
                    <Loader :fullscreen="false" v-if="loading" />
                    <div
                      class="highlight-unit"
                      v-for="post in posts"
                      :key="post.id"
                      @click="addNewStoryToCollection(post.id)"
                    >
                      <div class="cover-highlight">
                        <img
                          :src="post.cover"
                          alt=""
                        />
                      </div>
                      <div class="name-highlight">
                        {{ post.title }}
                      </div>
                    </div>
                  </div>
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
      this.$store.dispatch("highlights/addNewStoryToCollection", {
        collectionId: id,
        storyId: this.storyId
      }).then(() => {
        this.$store.dispatch("global/flashToast", "Story added to collection", {
          root: true
        });

        this.close();
      });

      
    },
    close() {
      this.$store.dispatch("modal/hide", { name: "chooseHighlight" });
    }
    // scrollFunction(e) {
    //   const { scrollHeight, scrollTop, offsetHeight } = e.srcElement;
    //   const scrolledEnought = scrollHeight - (offsetHeight + scrollTop) < 100;

    //   if (scrolledEnought && !this.loading && !this.allDataReceived) {
    //     this.$store.dispatch("stories/getPosts");
    //   }
    // }
  },
  created() {
    this.$store.dispatch("highlights/resetPageState");
    this.$store.dispatch("highlights/setSource", { source: this.user.id });
    // this.$store.dispatch("highlights/setLimit", { limit: 10 });
    this.$store.dispatch("highlights/getPosts");
  }
};
</script>
