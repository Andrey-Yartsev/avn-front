<template>
  <div :class="{ withPadding: $mq === 'mobile' }">
    <h3 class="title">Categories:</h3>
    <div class="categoriesContainer">
      <template v-for="category in categories">
        <label class="form-group-inner" :key="category.id">
          <div class="checkbox-wrapper">
            <input
              type="checkbox"
              :id="category.id"
              :value="category.id"
              v-model="selectedCategories"
            />
            <span class="label icn-item"
              >{{ category.name }}<span> ({{ category.amount }})</span></span
            >
          </div>
        </label>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "MediaCategories",
  props: ["value"],
  computed: {
    selectedCategories: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    },
    categories() {
      return (
        this.$store.state.profile.home.profile.mediaCategories || [
          { id: 1, name: "Male", amount: 8 },
          { id: 2, name: "Female", amount: 6 }
        ]
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.title {
  margin-bottom: 10px;
}
.categoriesContainer {
  display: flex;
  flex-flow: row wrap;
}
.form-group-inner {
  flex-grow: 1;
  flex-basis: 33.33%;
}
.withPadding {
  padding: 0 10px;
}
</style>
