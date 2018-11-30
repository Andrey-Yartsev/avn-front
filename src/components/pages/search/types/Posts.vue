<template>
  <div class="explore-wrapper posts">
    <template v-if="items.length">
      <div class="post-column">
        <Post
          v-for="post in posts1"
          v-bind:key="post.id"
          :post="post"
          from="search/page"
        />
      </div>
      <div class="post-column">
        <Post
          v-for="post in posts2"
          v-bind:key="post.id"
          :post="post"
          from="search/page"
        />
      </div>
    </template>
  </div>
</template>

<script>
import Post from "@/components/post/MediumView";

export default {
  name: "SearchPosts",

  props: ["items", "query", "loading"],

  components: {
    Post
  },

  computed: {
    posts1() {
      return this.items.filter((v, i) => !(i % 2));
    },
    posts2() {
      return this.items.filter((v, i) => i % 2);
    }
  }
};
</script>
