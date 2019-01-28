<template>
  <Modal :onClose="close">
    <div class="popup-container statistics-popup" slot="content">
      <div class="content" ref="content">
        <div class="popup-title popup-title_underlined">
          Posts

          <div
            class="more-functions more-functions_select"
            :class="{ open: showDropdown }"
            v-click-outside="
              () => {
                showDropdown = false;
              }
            "
          >
            <div class="more-functions__overlay"></div>
            <div
              class="more-functions__btn"
              @click="showDropdown = !showDropdown"
            >
              <div class="more-functions__btn-text">{{ periodTitle }}</div>
            </div>
            <div class="more-functions__dropdown">
              <div class="more-functions__dropdown-inside">
                <ul>
                  <li v-for="v in periodOptions" v-bind:key="v.value">
                    <button type="button" @click="selectPeriod(v.value)">
                      {{ v.title }}
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <Posts :dataSet="dataSet" :period="period" ref="posts" />
      </div>
      <button type="button" class="close" @click="close"></button>
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import Posts from "./Posts";
import ClickOutside from "vue-click-outside";

export default {
  name: "StatisticsPostsModal",

  components: {
    Modal,
    Posts
  },

  directives: {
    ClickOutside
  },

  props: {
    dataSet: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      period: "last_week",
      showDropdown: false
    };
  },

  created() {
    this.periodTitles = {
      today: "Today",
      last_week: "Last week",
      last_month: "Last month",
      last_year: "Last year"
    };
  },

  computed: {
    periodTitle() {
      return this.periodTitles[this.period];
    },
    periodOptions() {
      return Object.entries(this.periodTitles).map(v => {
        return {
          value: v[0],
          title: v[1]
        };
      });
    }
  },

  methods: {
    selectPeriod(period) {
      this.period = period;
      this.showDropdown = false;
      this.$emit("periodChange", period);
    },
    close() {
      this.$store.dispatch("modal/hide", { name: "statPosts" });
    }
  }
};
</script>

<style>
@media (min-width: 768px) {
  .popup .popup-container {
    max-width: 100%;
  }
}
</style>
