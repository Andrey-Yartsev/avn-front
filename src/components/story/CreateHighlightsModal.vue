<template>
  <Modal :onClose="close">
    <template slot="content">
      <div class="popup-container storyviewers-popup">
        <div class="content">
          CONTENT
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
  methods: {
    close() {
      this.$store.dispatch("modal/hide", { name: "createHighlights" });
    }
  }
};
</script>
