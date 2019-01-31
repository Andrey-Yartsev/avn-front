<template>
  <Modal :onClose="close">
    <template slot="content">
      <div class="popup-container storyviewers-popup">
        <div class="content">
          <div v-for="story in stories" :key="story.id">
            <img :src="story.thumb.source" />
          </div>
        </div>
        <button type="button" class="close" @click="close"></button>
      </div>
    </template>
  </Modal>
</template>

<script>
// import dateFns from "date-fns";
import Modal from "@/components/modal/Index";
// import VuePerfectScrollbar from "vue-perfect-scrollbar";

export default {
  name: "CreateHighlightsModal",
  components: {
    Modal
    // VuePerfectScrollbar
  },
  computed: {
    stories() {
      return this.$store.state.stories.posts;
    }
  },
  methods: {
    close() {
      this.$store.dispatch("modal/hide", { name: "createHighlights" });
    }
  },
  created() {
    this.$store.dispatch("stories/setSource", { source: "archive" });
    this.$store.dispatch("stories/getPosts");
  }
};
</script>
