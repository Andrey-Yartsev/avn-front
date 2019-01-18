<template>
  <Modal :onClose="close">
    <div class="popup-container statistics-popup" slot="content">
      <div class="content" ref="content">
        <div class="popup-title popup-title_underlined">
          Posts

          <div class="more-functions more-functions_select">
            <div class="more-functions__overlay"></div>
            <div class="more-functions__btn">
              <div class="more-functions__btn-text">Today</div>
            </div>
            <div class="more-functions__dropdown">
              <div class="more-functions__dropdown-inside">
                <ul>
                  <li>
                    <button type="button">Today</button>
                  </li>
                  <li>
                    <button type="button">Last week</button>
                  </li>
                  <li>
                    <button type="button">Last month</button>
                  </li>
                  <li>
                    <button type="button">Last year</button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <Posts :data="data" />
      </div>
      <button type="button" class="close" @click="close"></button>
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import Posts from "./Posts";

export default {
  name: "StatisticsPostsModal",

  components: {
    Modal,
    Posts
  },

  props: {
    data: {
      type: Array,
      required: true
    }
  },

  methods: {
    close() {}
  }
};
</script>
