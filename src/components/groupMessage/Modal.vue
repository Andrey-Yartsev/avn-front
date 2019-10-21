<template>
  <Modal :onClose="close">
    <template slot="content">
      <div class="popup-container popup-addPost">
        <div class="content content_relative">
          <div>
            <div class="popup-addPost__header hidden-mobile">
              Send group message to
              {{ this.$store.state.modal.groupMessage.data.type }} subscribers
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
  name: "groupMessageModal",
  components: {
    Modal,
    Form
  },
  computed: {
    title() {
      return !!this.$store.state.profile.links.editedLink;
    }
  },
  methods: {
    close(e) {
      e.preventDefault();
      this.$store.dispatch("modal/hide", { name: "groupMessage" });
      this.$store.commit("profile/links/endEditLink");
    }
    // submit({ data, editMode }) {}
  }
};
</script>
