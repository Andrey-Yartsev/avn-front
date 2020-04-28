<template>
  <div
    :class="['more-functions gender-wrapper', { open: opened }]"
    v-click-outside="hide"
  >
    <div class="more-functions__overlay" @click="hide" />
    <div class="more-functions__btn btn-gender" @click="open">
      <span class="icn-item icn-gender" :class="getClassName" />
    </div>
    <div class="more-functions__dropdown">
      <div class="more-functions__dropdown-inside">
        <ul class="more-functions__list">
          <li
            class="more-functions__item"
            v-for="v in options"
            :key="v.name"
            :class="{ selected: v.selected }"
          >
            <button
              type="button"
              class="more-functions__link btn-gender"
              @click="select(v.id)"
            >
              <span class="icn-item icn-gender" :class="v.cls" />
              <span class="btn-gender__text">{{ v.title }}</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import ClickOutside from "vue-click-outside";
import User from "@/mixins/user";

export default {
  name: "GenderFilter",
  directives: {
    ClickOutside
  },
  mixins: [User],
  data() {
    return {
      opened: false
    };
  },
  computed: {
    selected() {
      return this.$store.state.gender.category;
    },
    _options() {
      let options = [];
      try {
        options = this.$store.state.init.data.categoryView.map(v => {
          v.title = v.name[0].toUpperCase() + v.name.slice(1);
          return v;
        });
      } catch (_) {
        options = [];
      }
      return options;
    },
    options() {
      return this._options.map(v => {
        v.selected = this.selected === v.id;
        v.cls = {};
        v.cls[v.name] = true;
        return v;
      });
    },
    selectedOption() {
      const found = this.options.find(v => v.id === this.selected);
      if (!found) {
        return this.options[0];
      }
      return found;
    },
    getClassName() {
      return this.selectedOption && this.selectedOption.name
        ? this.selectedOption.name
        : "";
    }
  },
  methods: {
    toggle() {
      this.opened ? this.close() : this.open();
    },
    close() {
      this.opened = false;
    },
    open() {
      if (this.$mq === "mobile") {
        this.$store.commit("gender/openDropdown");
      } else {
        this.opened = true;
        this.$emit("openDropdown");
      }
    },
    hide() {
      if (this.$mq === "mobile") {
        this.$store.commit("gender/hideDropdown");
      } else {
        this.opened = false;
        this.$emit("hideDropdown");
      }
    },
    select(id) {
      this.$store.dispatch("gender/switchCategory", id);
      this.close();
    }
  }
};
</script>
