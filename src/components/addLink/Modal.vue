<template>
  <Modal :onClose="close">
    <template slot="content">
      <div class="popup-container popup-addPost">
        <div class="content content_relative">
          <div>
            <div class="popup-addPost__header hidden-mobile">
              Add new link
              <button
                type="button"
                class="close close_shift-t close_default icn-item icn-size_lg"
                @click="close"
              />
            </div>
            <Form :close="close" @submit="submit" />
          </div>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import Form from "./Form";

export default {
  name: "AddPostModal",
  components: {
    Modal,
    Form
  },
  methods: {
    close(e) {
      e.preventDefault();
      this.$store.dispatch("modal/hide", { name: "addLink" });
    },
    submit(data) {
      this.$store.dispatch("profile/home/addPost", data, { root: true });
    }
  }
};
</script>
