<template>
  <Modal :onClose="close">
    <div
      class="popup-container popup-container_block popup-alert"
      slot="content"
    >
      <div class="content">
        <template>
          <div class="popup-alert__title">
            Free access link
          </div>
          <div class="popup-alert__body">
            Share this one-off link to get free access to your media item
            <div class="popup-alert__link">
              {{ data.linkUrl }}
            </div>
          </div>
          <div class="popup-alert__footer">
            <button class="btn alt" @click.prevent="copy">Copy</button>
            <button class="btn alt" @click.prevent="close">Cancel</button>
          </div>
        </template>
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";

export default {
  name: "MediaAccessLinkModal",
  components: {
    Modal
  },
  computed: {
    data() {
      return this.$store.state.modal.mediaAccessLink.data;
    }
  },
  methods: {
    close() {
      this.$store.commit("modal/hideSafe", { name: "mediaAccessLink" });
    },
    copy() {
      this.$copyText(this.data.linkUrl).then(() => {
        this.$store.dispatch("global/flashToast", {
          text: "Link copied!"
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.popup-alert__link {
  margin: 10px 0;
  color: #2196f3;
}
</style>
