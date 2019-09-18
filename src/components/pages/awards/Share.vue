<template>
  <div class="awards-share">
    <ShareItem v-for="v in items" :key="v.id" :v="v" :isGay="isGay" />

    <div class="awards__btn-row">
      <button class="btn alt border lg" @click="$emit('complete')">
        Submit more nominations
      </button>
    </div>
  </div>
</template>

<script>
import ShareItem from "./ShareItem";
export default {
  name: "NominationShare",
  components: { ShareItem },
  props: {
    categories: Array,
    data: Object,
    modelUser: Object,
    isGay: Boolean
  },
  computed: {
    items() {
      const categories = this.categories.reduce((obj, item) => {
        obj[item.id] = item;
        return obj;
      }, {});
      return Object.entries(this.data).map(v => {
        let [categoryId, name] = v;

        if (
          this.modelUser &&
          typeof name === "number" &&
          this.modelUser.id === name
        ) {
          if (this.modelUser.twitterUsername) {
            name = "@" + this.modelUser.twitterUsername;
          } else {
            name = this.modelUser.name;
          }
        }
        return {
          category: categories[categoryId],
          name
        };
      });
    }
  }
};
</script>
