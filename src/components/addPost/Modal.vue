<template>
  <Modal :onClose="close">
    <template slot="content">
      <div class="popup-container popup-addPost">
        <div class="previous hidden"></div>
        <div class="content">
          <AddPost :initialExpanded="true" :close="close" />
        </div>
        <button type="button" class="close" @click="close"></button>
        <div class="next hidden"></div>
      </div>
    </template>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import AddPost from "./Index";

export default {
  name: "AddPostModal",
  components: {
    Modal,
    AddPost
  },
  methods: {
    close(e) {
      e.preventDefault();
      this.$store.dispatch("modal/hide", { name: "addPost" });
    }
  }
};
</script>
