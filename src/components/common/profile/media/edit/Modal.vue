<template>
  <Modal :onClose="close">
    <template slot="content">
      <div class="popup-container popup-addPost">
        <div class="content content_relative">
          <div
            class="popup-addPost__header hidden-mobile"
            v-if="$mq === 'desktop'"
          >
            Edit video
            <button
              type="button"
              class="close close_shift-t close_default icn-item icn-size_lg"
              @click.prevent="close"
            />
          </div>
          <EditMedia
            :initialExpanded="true"
            :close="close"
            :post="post"
            type="edit"
            where="modal"
          />
        </div>
      </div>
    </template>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import EditMedia from "@/components/common/profile/media/edit/EditMedia";

export default {
  name: "EditMediaModal",
  components: {
    Modal,
    EditMedia
  },
  computed: {
    post() {
      const editedMediaId = this.$store.state.profile.media.editedMedia;
      const mediaItem = this.$store.state.profile.media.media.find(
        item => item.productId === editedMediaId
      );
      return mediaItem || this.$store.state.mediaPage.media || null;
    }
  },
  methods: {
    close() {
      this.$store.dispatch("modal/hide", {
        name: "editMedia",
        data: {
          postId: null
        }
      });
    }
  }
};
</script>
