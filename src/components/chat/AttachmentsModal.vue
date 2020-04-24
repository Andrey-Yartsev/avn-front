<template>
  <Modal :onClose="close">
    <div class="popup-container chat-popup" slot="content">
      <div class="content" :class="{ 'content_column-mob': $mq === 'mobile' }">
        <div class="popup-addPost__header hidden-mobile bg-gradient_light">
          Attachments

          <div class="filter">
            <a
              href="#"
              :class="{ active: type === 'photo' }"
              @click.prevent="type = 'photo'"
              >Images</a
            >
            <a
              href="#"
              :class="{ active: type === 'video' }"
              @click.prevent="type = 'video'"
              >Videos</a
            >
          </div>

          <button
            type="button"
            class="close close_shift-t close_default icn-item icn-size_lg"
            @click="close"
          />
        </div>

        <div class="addPost-header">
          <button
            type="button"
            class="header-return-btn go-back go-back_times"
            @click="close"
          >
            <h1 class="category-name">
              Attachments
            </h1>
          </button>
          <div class="filter">
            <a
              href="#"
              :class="{ active: type === 'photo' }"
              @click.prevent="type = 'photo'"
              >Images</a
            >
            <a
              href="#"
              :class="{ active: type === 'video' }"
              @click.prevent="type = 'video'"
              >Videos</a
            >
          </div>
        </div>
        <Attachments :userId="userId" :type="type" />
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import Attachments from "./Attachments";

export default {
  name: "ChatAttachmentsModal",
  components: {
    Modal,
    Attachments
  },
  data() {
    return {
      type: "photo"
    };
  },
  computed: {
    userId() {
      return this.$store.state.modal.chatAttachments.data;
    }
  },
  methods: {
    close() {
      this.$store.dispatch("modal/hide", {
        name: "chatAttachments"
      });
    }
  }
};
</script>
