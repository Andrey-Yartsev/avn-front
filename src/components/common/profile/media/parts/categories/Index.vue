<template>
  <div class="categories">
    <span
      v-for="category in selectedCategories"
      :key="category.id"
      class="category"
    >
      {{ category.name }}
    </span>
  </div>
</template>

<script>
export default {
  name: "ClipCategories",
  props: {
    categories: Array
  },
  computed: {
    selectedCategories() {
      if (!this.$store.state.profile.media.mediaCategories) {
        return [];
      }
      const list = [];
      this.categories.forEach(item => {
        const matchedCategory = this.$store.state.profile.media.mediaCategories.find(
          category => category.id == item
        );
        matchedCategory && list.push(matchedCategory);
      });
      return list;
    }
  }
};
</script>

<style lang="scss" scoped>
.categories {
  margin: 5px 0;
  padding: 0 15px;
  .category {
    font-size: 12px;
    margin-right: 10px;
    padding: 2px 10px;
    color: white;
    background-color: #2196f3;
    border-radius: 10px;
  }
}
</style>
