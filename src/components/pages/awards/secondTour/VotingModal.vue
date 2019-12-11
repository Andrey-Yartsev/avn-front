<template>
  <Modal :onClose="close">
    <template slot="content">
      <div class="popup-container popup-addPost">
        <div class="content content_relative">
          <div
            class="popup-addPost__header hidden-mobile"
            v-if="$mq === 'desktop'"
          >
            Voting
            <button
              type="button"
              class="close close_shift-t close_default icn-item icn-size_lg"
              @click.prevent="close"
            />
          </div>
          <div>
            <h3>You can vote for me for next categories</h3>
            <ul>
              <li>
                <a href="#">Category 1</a>
              </li>
              <li>
                <a href="#">Category 2</a>
              </li>
            </ul>
          </div>
        </div>
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
      this.$store.dispatch("modal/hide", { name: "voting" });
    }
  }
};
</script>
