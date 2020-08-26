<template>
  <Modal :onClose="close">
    <div class="popup-container popup-statistics" slot="content">
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
            <div
              class="more-functions__overlay"
              @click="
                () => {
                  showDropdown = false;
                }
              "
            ></div>
            <div
              class="more-functions__btn"
              @click="showDropdown = !showDropdown"
            >
              <div class="more-functions__btn-text">{{ periodTitle }}</div>
            </div>
            <div class="more-functions__dropdown">
              <div class="more-functions__dropdown-inside">
                <ul class="more-functions__list">
                  <li
                    v-for="v in periodOptions"
                    v-bind:key="v.value"
                    class="more-functions__item"
                  >
                    <button
                      type="button"
                      @click="selectPeriod(v.value)"
                      class="more-functions__link"
                    >
                      <span class="more-functions__option">
                        {{ v.title }}
                      </span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <Posts :dataSet="dataSet" :period="period" ref="posts" />
      </div>
      <button
        type="button"
        class="close close_shift-t close_default close_visible-mob icn-item"
        @click="close"
      />
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
      period: "weekly",
      showDropdown: false
    };
  },

  created() {
    this.periodTitles = {
      today: "Today",
      weekly: "Last week",
      daily: "Last month",
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
