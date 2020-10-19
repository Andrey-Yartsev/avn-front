<template>
  <div class="more-functions__dropdown-inside">
    <ul class="more-functions__list">
      <template v-if="isAuthor">
        <li class="more-functions__item">
          <span
            class="edit more-functions__link menuItemWrapper"
            type="button"
            @click.prevent="
              handleClick({ filter: '', order: 'ASC', sort: 'default' })
            "
          >
            <span
              v-if="filterType === ''"
              class="status-card on icn-item checkmark"
            />
            <span
              class="more-functions__option menuItem"
              :class="{ selected: filterType === '' }"
              >All</span
            >
          </span>
        </li>
        <li class="more-functions__item ">
          <span
            class="edit more-functions__link menuItemWrapper"
            type="button"
            @click.prevent="
              handleClick({ filter: 'sale', order: 'ASC', sort: 'default' })
            "
          >
            <span
              v-if="filterType === 'sale'"
              class="status-card on icn-item checkmark"
            />
            <span
              class="more-functions__option menuItem"
              :class="{ selected: filterType === 'sale' }"
              >On Sale</span
            >
          </span>
        </li>
        <li class="more-functions__item ">
          <span
            class="edit more-functions__link menuItemWrapper"
            type="button"
            @click.prevent="
              handleClick({ filter: 'draft', order: 'ASC', sort: 'default' })
            "
          >
            <span
              v-if="filterType === 'draft'"
              class="status-card on icn-item checkmark"
            />
            <span
              class="more-functions__option menuItem"
              :class="{ selected: filterType === 'draft' }"
              >Draft</span
            >
          </span>
        </li>
        <li class="more-functions__item ">
          <span
            class="edit more-functions__link menuItemWrapper"
            type="button"
            @click.prevent="
              handleClick({
                filter: 'scheduled',
                order: 'ASC',
                sort: 'default'
              })
            "
          >
            <span
              v-if="filterType === 'scheduled'"
              class="status-card on icn-item checkmark"
            />
            <span
              class="more-functions__option menuItem"
              :class="{ selected: filterType === 'scheduled' }"
              >Scheduled</span
            >
          </span>
        </li>
      </template>
      <template v-if="!isAuthor && user">
        <li class="more-functions__item ">
          <span
            class="edit more-functions__link menuItemWrapper"
            type="button"
            @click.prevent="
              handleClick({
                filter: 'purchases',
                order: 'ASC',
                sort: 'default'
              })
            "
          >
            <span
              v-if="filterType === 'purchases'"
              class="status-card on icn-item checkmark"
            />
            <span
              class="more-functions__option menuItem"
              :class="{ selected: filterType === 'purchases' }"
              >My Purchases Only</span
            >
          </span>
        </li>
      </template>
      <template>
        <li class="more-functions__item ">
          <span
            class="edit more-functions__link menuItemWrapper"
            type="button"
            @click.prevent="
              handleClick({ filter: '', order: 'DESC', sort: 'date' })
            "
          >
            <span
              v-if="
                filterType === '' && sortType === 'date' && orderType === 'DESC'
              "
              class="status-card on icn-item checkmark"
            />
            <span
              class="more-functions__option menuItem"
              :class="{
                selected:
                  filterType === '' &&
                  sortType === 'date' &&
                  orderType === 'DESC'
              }"
              >Newest</span
            >
          </span>
        </li>
        <li class="more-functions__item ">
          <span
            class="edit more-functions__link menuItemWrapper"
            type="button"
            @click.prevent="
              handleClick({ filter: '', order: 'ASC', sort: 'date' })
            "
          >
            <span
              v-if="
                filterType === '' && sortType === 'date' && orderType === 'ASC'
              "
              class="status-card on icn-item checkmark"
            />
            <span
              class="more-functions__option menuItem"
              :class="{
                selected:
                  filterType === '' &&
                  sortType === 'date' &&
                  orderType === 'ASC'
              }"
              >Oldest</span
            >
          </span>
        </li>
        <li class="more-functions__item ">
          <span
            class="edit more-functions__link menuItemWrapper"
            type="button"
            @click.prevent="
              handleClick({ filter: '', order: 'DESC', sort: 'price' })
            "
          >
            <span
              v-if="
                filterType === '' &&
                  sortType === 'price' &&
                  orderType === 'DESC'
              "
              class="status-card on icn-item checkmark"
            />
            <span
              class="more-functions__option menuItem"
              :class="{
                selected:
                  filterType === '' &&
                  sortType === 'price' &&
                  orderType === 'DESC'
              }"
              >Price: Hight to Low</span
            >
          </span>
        </li>
        <li class="more-functions__item ">
          <span
            class="edit more-functions__link menuItemWrapper"
            type="button"
            @click.prevent="
              handleClick({ filter: '', order: 'ASC', sort: 'price' })
            "
          >
            <span
              v-if="
                filterType === '' && sortType === 'price' && orderType === 'ASC'
              "
              class="status-card on icn-item checkmark"
            />
            <span
              class="more-functions__option menuItem"
              :class="{
                selected:
                  filterType === '' &&
                  sortType === 'price' &&
                  orderType === 'ASC'
              }"
              >Price: Low to High</span
            >
          </span>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
export default {
  name: "FilterDropdown",
  props: {
    filterType: {
      type: String,
      required: true
    },
    sortType: {
      type: String,
      required: true
    },
    orderType: {
      type: String,
      required: true
    },
    isAuthor: {
      type: Boolean,
      required: true
    },
    isListView: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClick(data) {
      this.$emit("handleClick", data);
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
