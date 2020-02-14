<template>
  <Modal :onClose="close">
    <template slot="content">
      <div class="popup-container popup-addPost">
        <div class="content content_relative">
          <div
            class="popup-addPost__header hidden-mobile"
            v-if="$mq === 'desktop'"
          >
            Edit post
            <button
              type="button"
              class="close close_shift-t close_default icn-item icn-size_lg"
              @click.prevent="close"
            />
          </div>
          <EditPost
            :initialExpanded="true"
            :close="close"
            :post="post"
            type="edit"
            where="modal"
            ref="editPost"
          />
        </div>
      </div>
    </template>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import EditPost from "@/components/post/add/Index";

export default {
  name: "EditPostModal",
  components: {
    Modal,
    EditPost
  },
  computed: {
    post() {
      return this.$store.state.postPage.posts[0];
    }
  },
  methods: {
    close() {
      if (this.$refs.editPost.uploadInProgress) {
        this.$store.dispatch("modal/show", {
          name: "confirm",
          data: {
            title: "Upload in progress",
            success: () => {
              this.$store.dispatch("modal/hide", { name: "editPost" });
            }
          }
        });
        return;
      }
      this.$store.dispatch("modal/hide", { name: "editPost" });
    }
  },
  created() {
    this.$store.dispatch("postPage/resetPageState");
    const postId = this.$store.state.modal.editPost.data.postId;
    this.$store.dispatch("postPage/getPost", { postId });
  }
};
</script>
