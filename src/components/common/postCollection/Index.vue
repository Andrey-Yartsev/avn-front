<template>
  <div class="postCollectionView">
      <div class="new-post-toast"><span>See 1 new post</span></div>
      <div class="posts">
      <Post
        v-for="post in posts"
        v-bind:post="post"
        :key="post.id"
        :from="from"
      ></Post>
    </div>
  </div>
</template>

<script>
import Post from "@/components/post/MediumView";

export default {
  name: "PostCollection",
  components: {
    Post: Post
  },
  props: {
    posts: {
      type: Array,
      required: true
    },
    from: {
      type: String,
      required: true
    }
  }
};
</script>
