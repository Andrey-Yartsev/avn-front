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
                    <div class="highlight-unit">
                      <div class="cover-highlight">
                        <img src="https://storage.onmyteam.com/get/dev/files/9/9b/9b6f0ba0a9f41dabd8519c9442ade2a1/440x440_9971fc8719b7d4d218e158f6abf1f278924305.jpg" alt="">
                      </div>
                      <div class="name-highlight">
                        My first group name
                      </div>
                    </div>
                    <div class="highlight-unit">
                      <div class="cover-highlight">
                        <img src="https://storage.onmyteam.com/get/dev/files/9/9b/9b6f0ba0a9f41dabd8519c9442ade2a1/440x440_9971fc8719b7d4d218e158f6abf1f278924305.jpg" alt="">
                      </div>
                      <div class="name-highlight">
                        My first group name
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
