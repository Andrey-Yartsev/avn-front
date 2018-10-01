<template>
  <div
    class="user-color-select"
    :class="{'user-color-select-visible': visible}"
    v-click-outside="hide"
  >
    <input type="hidden" :name="name" :value="value">
    <div class="user-color-select-wrapper options-color-definition" :class="wrapperClass">
      <div class="select" @click="toggle">
        <span class="select__text">{{ label }}</span>
      </div>
      <div class="options-wrapper">
        <span class="close" @click="toggle"></span>
        <p>{{ text }}</p>
        <div class="options-wrap">
          <div class="options" data-type="primary">
            <span
              role="button"
              class="option option_col-6"
              :class="{['option-' + v]: true, active: isActive(v)}"
              :data-color="v"
              v-bind:key="v"
              v-for="v in options"
              @click="change(v)"
            ></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ClickOutside from "vue-click-outside";

export default {
  name: "ColorSelect",

  directives: {
    ClickOutside
  },

  props: {
    name: String,
    wrapperClass: String,
    label: String,
    value: Number,
    text: String
  },

  data() {
    return {
      visible: false,
      options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    };
  },

  methods: {
    toggle() {
      this.visible = !this.visible;
    },
    hide() {
      this.visible = false;
    },
    isActive(value) {
      return this.value === value;
    },
    change(value) {
      this.$emit("input", value);
      this.toggle();
    }
  }
};
</script>

<style lang="scss">
.user-color-select {
  width: 100%;

  &-visible {
    .options-wrapper {
      display: block !important;
    }
    .user-color-select-wrapper .select:before {
      visibility: visible;
      opacity: 1;
    }
  }
}
</style>
