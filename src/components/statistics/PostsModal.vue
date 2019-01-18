<template>
  <Modal :onClose="close">
    <div class="popup-container" slot="content">
      <div class="content" ref="content">
        <div class="popup-title">Posts</div>
        <Posts :data="data" />
      </div>
      <button type="button" class="close" @click="close"></button>
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import Posts from "./Posts";

export default {
  name: "StatisticsPostsModal",

  components: {
    Modal,
    Posts
  },

  props: {
    data: {
      type: Array,
      required: true
    }
  },

  methods: {
    close() {}
  }
};
</script>
