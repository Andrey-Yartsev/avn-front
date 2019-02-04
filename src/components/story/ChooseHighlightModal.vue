<template>
  <Modal :onClose="close">
    <template slot="content">
      <div class="popup-container popup-container_hfluid highlights-popup">
        <div class="content">
          Choose highlights
        </div>
        <button type="button" class="close" @click="close"></button>
      </div>
    </template>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
// import VuePerfectScrollbar from "vue-perfect-scrollbar";
// import Loader from "@/components/common/Loader";

export default {
  name: "ChooseHighlights",
  components: {
    Modal // ,
    // VuePerfectScrollbar,
    // Loader
  },
  data() {
    return {};
  },
  computed: {
    // loading() {
    //   return this.$store.state.stories.loading;
    // },
    // allDataReceived() {
    //   return this.$store.state.stories.allDataReceived;
    // },
    // stories() {
    //   return this.$store.state.stories.posts;
    // },
  },
  methods: {
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
    // this.$store.dispatch("stories/resetPageState");
    // this.$store.dispatch("stories/setSource", { source: "archive" });
    // this.$store.dispatch("stories/setLimit", { limit: 20 });
    // this.$store.dispatch("stories/getPosts");
  }
};
</script>
