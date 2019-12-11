<template>
  <Modal :onClose="close">
    <template slot="content">
      <div class="popup-container post post-popup">
        <div
          class="content"
          :class="{ 'content_column-mob': $mq === 'mobile' }"
        >
          <div class="postPageWrapper postPageWrapper_in-popup">
            <div class="votingContainer">Hello</div>
          </div>
        </div>
        <button
          type="button"
          class="close close_default icn-item icn-size_lg"
          @click="close"
        />
      </div>
    </template>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";

export default {
  name: "MediaModal",
  components: {
    Modal
  },
  data() {
    return {};
  },
  computed: {},
  methods: {
    close() {
      console.log("close");
    }
  }
};
</script>

<style lang="scss" scoped>
.votingContainer {
  width: 300px;
  height: 200px;
  background-color: pink;
}
</style>
