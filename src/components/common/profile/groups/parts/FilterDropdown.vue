<template>
  <div class="more-functions__dropdown-inside">
    <ul class="more-functions__list">
      <template v-if="isAuthor">
        <li class="more-functions__item">
          <span
            class="edit more-functions__link menuItemWrapper"
            type="button"
            @click.prevent="handleClick('all')"
          >
            <span
              v-if="type === 'all'"
              class="status-card on icn-item checkmark"
            />
            <span
              class="more-functions__option menuItem"
              :class="{ selected: type === 'all' }"
              >All</span
            >
          </span>
        </li>
        <li class="more-functions__item ">
          <span
            class="edit more-functions__link menuItemWrapper"
            type="button"
            @click.prevent="handleClick('public')"
          >
            <span
              v-if="type === 'public'"
              class="status-card on icn-item checkmark"
            />
            <span
              class="more-functions__option menuItem"
              :class="{ selected: type === 'public' }"
              >Public</span
            >
          </span>
        </li>
        <li class="more-functions__item ">
          <span
            class="edit more-functions__link menuItemWrapper"
            type="button"
            @click.prevent="handleClick('private')"
          >
            <span
              v-if="type === 'private'"
              class="status-card on icn-item checkmark"
            />
            <span
              class="more-functions__option menuItem"
              :class="{ selected: type === 'private' }"
              >Private</span
            >
          </span>
        </li>
      </template>
      <li class="more-functions__item ">
        <span
          class="edit more-functions__link menuItemWrapper"
          type="button"
          @click.prevent="handleClick('active')"
        >
          <span
            v-if="type === 'active'"
            class="status-card on icn-item checkmark"
          />
          <span
            class="more-functions__option menuItem"
            :class="{ selected: type === 'active' }"
            >Active</span
          >
        </span>
      </li>
      <li class="more-functions__item ">
        <span
          class="edit more-functions__link menuItemWrapper"
          type="button"
          @click.prevent="handleClick('draft')"
        >
          <span
            v-if="type === 'draft'"
            class="status-card on icn-item checkmark"
          />
          <span
            class="more-functions__option menuItem"
            :class="{ selected: type === 'draft' }"
            >Draft</span
          >
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
    },
    isAuthor: {
      type: Boolean,
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
  .menuItem {
    margin-left: auto;
  }
}
</style>
