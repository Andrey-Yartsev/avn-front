<template>
  <div
    class="more-functions more-functions_dir-inverse more-functions_sticky more-functions_sticky-br"
    :class="{ open: opened }"
    v-click-outside="hide"
  >
    <div class="more-functions__overlay" @click="hide"></div>
    <div class="more-functions__btn" @click="show"></div>
    <div class="more-functions__dropdown">
      <div class="more-functions__dropdown-inside">
        <ul class="more-functions__list">
          <li class="more-functions__item">
            <button
              type="button"
              class="btn-toggle-state more-functions__link icn-item"
              :class="{ checked: noOneActive }"
              @click="onChangeValue('none')"
            >
              <span class="more-functions__option">
                No filter
              </span>
            </button>
          </li>
          <li
            class="more-functions__item"
            v-for="filter in filters"
            :key="filter.id"
          >
            <button
              type="button"
              class="btn-toggle-state more-functions__link icn-item"
              :class="{ checked: filter.active }"
              @click="onChangeValue(filter.id)"
            >
              <span class="more-functions__option">
                {{ filter.name }}
              </span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import ClickOutside from "vue-click-outside";

export default {
  name: "StreamFilter",
  directives: {
    ClickOutside
  },
  props: {
    filters: {
      type: Array,
      isRequired: true
    },
    onChange: {
      type: Function,
      isRequired: true
    }
  },
  data() {
    return {
      opened: false
    };
  },
  computed: {
    noOneActive() {
      return !this.filters.filter(item => item.active).length;
    }
  },
  methods: {
    show() {
      this.opened = true;
    },
    hide() {
      this.opened = false;
    },
    onChangeValue(value) {
      this.hide();
      this.onChange(value);
    }
  }
};
</script>
