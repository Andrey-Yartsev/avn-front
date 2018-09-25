<template>
    <div class="post-header" :id="id">
        <router-link class="avatar" :to="user.publicUrl">
            <img :src="user.avatar" />
        </router-link>
        <router-link class="name" :to="user.publicUrl">{{ user.username }}</router-link>
        <template v-if="user.isVerified">
          <span class="verified-user"></span>
        </template>
        <span class="user-login">
                <router-link :to="user.publicUrl">{{ user.username }}</router-link>
            </span>
        <span class="post-dropdown-menu-btn" v-on:click="isShowDropdawn = !isShowDropdawn"></span>
        <PostDropdawn v-bind:class="{ hidden: !isShowDropdawn }"></PostDropdawn>
    </div>
</template>

<script>
import PostDropdawn from "./PostDropdawn";

export default {
  name: "PostHeader",
  components: {
    PostDropdawn: PostDropdawn
  },
  data: function() {
    return {
      isShowDropdawn: false
    };
  },
  props: {
    id: {
      type: Number,
      required: true
    },
    user: {
      type: Object,
      required: true
    }
  }
};
</script>
