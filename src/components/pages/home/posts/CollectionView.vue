<template>
  <div class="feed">
    <div class="postCollectionView">
      <div class="posts">
        <Post v-for="post in posts" v-bind:item="post" :key="post.id"></Post>
      </div>
      <div class="no-results-search">
        <div class="no-results-search__message">
          <span class="no-results-search__text">Nothing found for</span> <span class="searchAllTag">""</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Post from "./post/Index";

export default {
  name: "CollectionView",
  components: {
    Post: Post
  },
  props: {
    posts: {
      type: Array,
      required: true
    }
  }
};
</script>

<style lang="scss" src="@/design/css/posts.scss">
</style>
