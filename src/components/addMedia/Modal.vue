<template>
  <Modal :onClose="close">
    <template slot="content">
      <div class="popup-container popup-addPost">
        <div class="content content_relative">
          <div>
            <div class="popup-addPost__header hidden-mobile">
              {{ isEditMode ? "Edit media file" : "Add media files" }}
              <button
                type="button"
                class="close close_shift-t close_default icn-item icn-size_lg"
                @click="close"
              />
            </div>
            <AddMessageBox
              @send="submitHandler"
              :withUser="user"
              :withFontSizeController="false"
              :textareaPlaceholder="textareaPlaceholder"
              :withTips="false"
              :multipleMedia="true"
            />
          </div>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import AddMessageBox from "../chat/AddMessageBox";

export default {
  name: "AddMediaModal",
  components: {
    Modal,
    AddMessageBox
  },
  data() {
    return {
      textareaPlaceholder: "Title"
    };
  },
  computed: {
    isEditMode() {
      return !!this.$store.state.profile.media.editedMedia;
    }
  },
  methods: {
    close(e) {
      e.preventDefault();
      this.$store.dispatch("modal/hide", { name: "addMedia" });
      this.$store.commit("profile/media/endEditMedia");
    },
    submit(data) {
      console.log(data);
      this.isEditMode
        ? this.$store.dispatch("profile/media/updateMedia", data, {
            root: true
          })
        : this.$store.dispatch("profile/media/addMedia", data, { root: true });
    }
  }
};
</script>
