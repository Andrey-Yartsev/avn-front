<template>
  <div class="post-header" :id="id">
    <router-link class="avatar" :to="'/' + user.username">
      <img :src="user.avatar"/>
    </router-link>
    <router-link class="name" :to="'/' + user.username">{{ user.username }}</router-link>
    <template v-if="user.isVerified">
      <span class="verified-user"></span>
    </template>
    <span class="user-login">
      <router-link :to="'/' + user.username">{{ user.username }}</router-link>
    </span>
    <span class="post-dropdown-menu-btn" v-on:click="isShowDropdown = !isShowDropdown"></span>
    <PostDropdown
      v-bind:class="{ hidden: !isShowDropdown }"
      :postId="id"
      :userId="user.id"
      :isProfilePost="isProfilePost"
    ></PostDropdown>
  </div>
</template>

<script>
import Dropdown from "./Dropdown";

export default {
  name: "Header",
  components: {
    Dropdown
  },
  data: () => ({
    isShowDropdown: false
  }),
  props: {
    postId: {
      type: Number,
      required: true
    },
    user: {
      type: Object,
      required: true
    },
    isProfilePost: {
      type: Boolean,
      default: false
    }
  }
};
</script>
