<template>
  <Modal :onClose="close">
    <template slot="content">
      <div class="popup-container popup-reasons">
        <div class="popup__header m-underline-border smallFontSize">
          Vote for me for the AVN Awards!
        </div>
        <div class="popup__content">
          <ul class="category-list">
            <li
              v-for="category in data"
              :key="category.nomineeId"
              class="category-list__item"
            >
              <a :href="url(category)" class="category-list__name">{{
                category.categoryName
              }}</a>
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
  computed: {
    data() {
      return this.$store.state.modal.voting.data.list;
    }
  },
  methods: {
    close() {
      this.$store.dispatch("modal/hide", { name: "voting" });
    },
    url(v) {
      const awardsType = v.eventId == 91 ? "/avn_awards/" : "/gayvn_awards/";
      return (
        window.location.origin +
        "/vote/" +
        v.nomineeId +
        awardsType +
        v.categoryId
      );
    }
  }
};
</script>
