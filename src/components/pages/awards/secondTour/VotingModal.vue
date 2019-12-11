<template>
  <Modal :onClose="close">
    <template slot="content">
      <div class="popup-container popup-reasons">
        <div class="popup__header m-underline-border">
          Voting
        </div>
        <h3 class="popup-alert__title">
          You can vote for me for next categories
        </h3>
        <div class="popup__content">
          <ul class="category-list">
            <li class="category-list__item">
              <a href="#" class="category-list__name">Category 1</a>
            </li>
            <li class="category-list__item">
              <a href="#" class="category-list__name">Category 2</a>
            </li>
          </ul>
        </div>
        <button
          type="button"
          class="close close_shift-t close_default close_visible-mob icn-item icn-size_lg"
          @click.prevent="close"
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
      this.$store.dispatch("modal/hide", { name: "voting" });
    }
  }
};
</script>
