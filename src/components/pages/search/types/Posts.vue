<template>
  <div class="explore-wrapper posts">
    <template v-if="items.length">
      <template v-if="$mq === 'desktop'">
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
      <template v-else>
        <Post
          v-for="post in posts"
          v-bind:key="post.id"
          :post="post"
          from="search/page"
        />
      </template>
    </template>
  </div>
</template>

<script>
import Post from "@/components/post/MediumView";
import PostsStat from "@/mixins/postsStat";

export default {
  name: "SearchPosts",

  props: ["items", "query", "loading"],

  mixins: [PostsStat],

  components: {
    Post
  },

  computed: {
    posts1() {
      return this.items.filter((v, i) => !(i % 2));
    },
    posts2() {
      return this.items.filter((v, i) => i % 2);
    },
    posts() {
      return this.items;
    }
  }
};
</script>
