<template>
  <div class="postCollectionView">
    <div class="posts">
      <Post
        v-for="post in posts"
        v-bind:post="post"
        :key="post.id"
        :from="from"
        @visibilityChanged="visibilityChanged"
      >
        <template v-if="post.innerPost">
          <div class="innerPost_wrapper">
            <Post
              :post="post.innerPost"
              :from="from"
              :isReposted="true"
              @visibilityChanged="visibilityChanged"
            />
          </div>
        </template>
      </Post>
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

<style lang="scss" scoped>
.innerPost_wrapper {
  border: 1px solid rgba(124, 139, 150, 0.2);
  margin: 20px;
}
</style>
