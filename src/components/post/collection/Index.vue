<template>
  <div class="postCollectionView">
    <div class="posts">
      <Post
        v-for="post in posts"
        v-bind:post="post"
        :key="post.id"
        :from="from"
        @visibilityChanged="visibilityChanged"
      ></Post>
    </div>
  </div>
</template>

<script>
import Post from "@/components/post/view/MediumView";
import PostsStat from "@/mixins/post/statMany";
import UserMixin from "@/mixins/user";

export default {
  name: "PostCollection",
  mixins: [PostsStat, UserMixin],
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
  },
  methods: {
    visibilityChanged(data) {
      this.$emit("visibilityChanged", data);
    }
  }
};
</script>
