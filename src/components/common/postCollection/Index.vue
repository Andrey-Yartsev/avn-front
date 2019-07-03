<template>
  <div class="postCollectionView">
    <template v-if="false">
      <div class="post-secret">
        <img :src="user.avatar" alt="" class="post-secret__img" />
        <span class="post-secret__text">
          Subscription required to see posts
        </span>
      </div>
      <div class="post-secret post-secret_no-avatar">
        <span class="post-secret__text">
          Subscription required to see posts
        </span>
      </div>
    </template>
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
import PostsStat from "@/mixins/postsStat";
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
  }
};
</script>
