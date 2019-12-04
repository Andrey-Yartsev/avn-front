<template>
  <div class="more-functions__dropdown-inside">
    <ul class="more-functions__list">
      <li class="more-functions__item">
        <span
          class="edit more-functions__link menuItemWrapper"
          type="button"
          @click.prevent="handleClick('')"
        >
          <span
            class="more-functions__option menuItem"
            :class="{ selected: type === '' }"
            >All</span
          >
          <span v-if="type === ''" class="status-card on icn-item checkmark" />
        </span>
      </li>
      <li class="more-functions__item ">
        <span
          class="edit more-functions__link menuItemWrapper"
          type="button"
          @click.prevent="handleClick('sale')"
        >
          <span
            class="more-functions__option menuItem"
            :class="{ selected: type === 'sale' }"
            >On Sale</span
          >
          <span
            v-if="type === 'sale'"
            class="status-card on icn-item checkmark"
          />
        </span>
      </li>
      <li class="more-functions__item ">
        <span
          class="edit more-functions__link menuItemWrapper"
          type="button"
          @click.prevent="handleClick('draft')"
        >
          <span
            class="more-functions__option menuItem"
            :class="{ selected: type === 'draft' }"
            >Draft</span
          >
          <span
            v-if="type === 'draft'"
            class="status-card on icn-item checkmark"
          />
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "FilterDropdown",
  props: {
    type: {
      type: String,
      required: true
    }
  },
  methods: {
    handleClick(type) {
      this.$emit("handleClick", type);
    }
  }
};
</script>

<style lang="scss" scoped>
.menuItemWrapper {
  position: relative;
  display: flex;
  justify-content: space-between;
  .selected {
    color: black;
    font-weight: bold;
  }
  .checkmark {
    position: relative;
    font-size: 16px;
    line-height: 16px;
  }
}
</style>
