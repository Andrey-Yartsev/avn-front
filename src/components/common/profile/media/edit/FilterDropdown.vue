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
            @click.prevent="handleClick('sale')"
          >
            <span
              v-if="type === 'sale'"
              class="status-card on icn-item checkmark"
            />
            <span
              class="more-functions__option menuItem"
              :class="{ selected: type === 'sale' }"
              >On Sale</span
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
      </template>
      <template v-if="!isAuthor && user">
        <li class="more-functions__item ">
          <span
            class="edit more-functions__link menuItemWrapper"
            type="button"
            @click.prevent="handleClick('purchases')"
          >
            <span
              v-if="type === 'purchases'"
              class="status-card on icn-item checkmark"
            />
            <span
              class="more-functions__option menuItem"
              :class="{ selected: type === 'purchases' }"
              >My Purchases Only</span
            >
          </span>
        </li>
      </template>
      <li class="more-functions__item ">
        <span
          class="edit more-functions__link menuItemWrapper"
          type="button"
          @click.prevent="handleClick('dateNew')"
        >
          <span
            v-if="type === 'dateNew'"
            class="status-card on icn-item checkmark"
          />
          <span
            class="more-functions__option menuItem"
            :class="{ selected: type === 'dateNew' }"
            >Newest</span
          >
        </span>
      </li>
      <li class="more-functions__item ">
        <span
          class="edit more-functions__link menuItemWrapper"
          type="button"
          @click.prevent="handleClick('dateOld')"
        >
          <span
            v-if="type === 'dateOld'"
            class="status-card on icn-item checkmark"
          />
          <span
            class="more-functions__option menuItem"
            :class="{ selected: type === 'dateOld' }"
            >Oldest</span
          >
        </span>
      </li>
      <li class="more-functions__item ">
        <span
          class="edit more-functions__link menuItemWrapper"
          type="button"
          @click.prevent="handleClick('priceHight')"
        >
          <span
            v-if="type === 'priceHight'"
            class="status-card on icn-item checkmark"
          />
          <span
            class="more-functions__option menuItem"
            :class="{ selected: type === 'priceHight' }"
            >Price: Hight to Low</span
          >
        </span>
      </li>
      <li class="more-functions__item ">
        <span
          class="edit more-functions__link menuItemWrapper"
          type="button"
          @click.prevent="handleClick('priceLow')"
        >
          <span
            v-if="type === 'priceLow'"
            class="status-card on icn-item checkmark"
          />
          <span
            class="more-functions__option menuItem"
            :class="{ selected: type === 'priceLow' }"
            >Price: Low to High</span
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
  },
  computed: {
    user() {
      return this.$store.state.auth.user;
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
