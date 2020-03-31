<template>
  <Modal :onClose="close">
    <template slot="content">
      <div class="popup-container popup-addPost">
        <div class="content content_relative">
          <div>
            <div
              class="popup-addPost__header hidden-mobile"
              v-if="$mq === 'desktop'"
            >
              Add comment
              <button
                type="button"
                class="close close_shift-t close_default icn-item icn-size_lg"
                @click="close"
              />
            </div>
            <AddComment
              :initialExpanded="true"
              :close="close"
              type="new"
              where="modal"
              ref="addPost"
            />
          </div>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import AddComment from "./Index";

export default {
  name: "RepostCommentModal",
  components: {
    Modal,
    AddComment
  },
  methods: {
    close() {
      this.$store.dispatch("modal/hide", { name: "postRepostComment" });
    }
  },
  computed: {},
  created() {}
};
</script>
