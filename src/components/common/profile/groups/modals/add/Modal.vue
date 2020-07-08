<template>
  <Modal :onClose="close">
    <template slot="content">
      <div class="popup-container popup-addPost">
        <div class="content content_relative">
          <div
            class="popup-addPost__header hidden-mobile"
            v-if="$mq === 'desktop'"
          >
            New group
            <button
              type="button"
              class="close close_shift-t close_default icn-item icn-size_lg"
              @click="close"
            />
          </div>
          <AddGroup
            :initialExpanded="true"
            :close="close"
            type="new"
            where="modal"
            ref="addGroup"
          />
        </div>
      </div>
    </template>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import AddGroup from "./Index";
import Loader from "@/components/common/Loader";

export default {
  name: "AddGroupModal",
  components: {
    Modal,
    AddGroup,
    Loader
  },
  methods: {
    close() {
      if (this.$refs.addGroup.uploadInProgress) {
        this.$store.dispatch("modal/show", {
          name: "confirm",
          data: {
            title: "Upload in progress",
            success: () => {
              this.$store.dispatch("modal/hide", { name: "addGroup" });
            }
          }
        });
        return;
      }
      this.$store.dispatch("modal/hide", { name: "addGroup" });
    }
  }
};
</script>
