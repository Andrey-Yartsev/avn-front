<template>
  <Modal :onClose="close">
    <template slot="content">
      <div class="popup-container popup-addPost">
        <div class="content content_relative">
          <div
            class="popup-addPost__header hidden-mobile"
            v-if="$mq === 'desktop'"
          >
            Edit group
            <button
              type="button"
              class="close close_shift-t close_default icn-item icn-size_lg"
              @click.prevent="close"
            />
          </div>
          <EditGroup
            :initialExpanded="true"
            :close="close"
            :post="post"
            type="edit"
            where="modal"
            ref="editGroup"
          />
        </div>
      </div>
    </template>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import EditGroup from "../add/Index";

export default {
  name: "EditGroupModal",
  components: {
    Modal,
    EditGroup
  },
  computed: {
    post() {
      return this.$store.state.modal.editGroup.data.group;
    }
  },
  methods: {
    close() {
      if (this.$refs.editGroup.uploadInProgress) {
        this.$store.dispatch("modal/show", {
          name: "confirm",
          data: {
            title: "Upload in progress",
            success: () => {
              this.$store.dispatch("modal/hide", { name: "editGroup" });
            }
          }
        });
        return;
      }
      this.$store.dispatch("modal/hide", { name: "editGroup" });
    }
  }
};
</script>
