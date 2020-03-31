<template>
  <div class="categories">
    <span v-for="category in categories" :key="category.id" class="category">
      {{ category.name }}
    </span>
  </div>
</template>

<script>
export default {
  name: "ClipCategories",
  // data() {
  //   return {
  //     categories: [
  //       { id: 1, name: "Male" },
  //       { id: 2, name: "Female" }
  //     ]
  //   };
  // }
  props: {
    categiries: Array
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
