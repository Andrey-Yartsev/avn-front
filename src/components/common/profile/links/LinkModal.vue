<template>
  <Modal :onClose="close">
    <template slot="content">
      <div class="popup-container popup-addPost">
        <div class="content content_relative">
          <div>
            <div class="popup-addPost__header hidden-mobile">
              {{ isEditMode ? "Edit link" : "Add new link" }}
              <button
                type="button"
                class="close close_shift-t close_default icn-item icn-size_lg"
                @click="close"
              />
            </div>
            <LinkModalForm :close="close" @submit="submit" />
          </div>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import LinkModalForm from "@/components/common/profile/links/LinkModalForm";

export default {
  name: "LinkModal",
  components: {
    Modal,
    LinkModalForm
  },
  computed: {
    isEditMode() {
      return !!this.$store.state.profile.links.editedLink;
    }
  },
  methods: {
    close(e) {
      e.preventDefault();
      this.$store.dispatch("modal/hide", { name: "addLink" });
      this.$store.commit("profile/links/endEditLink");
    },
    submit({ data, editMode }) {
      if (data.url.indexOf("http") !== 0 && data.url.indexOf("/") !== 0) {
        data.url = "/" + data.url;
      }
      editMode
        ? this.$store.dispatch("profile/links/updateLink", data, { root: true })
        : this.$store.dispatch("profile/links/addLink", data, { root: true });
    }
  }
};
</script>
