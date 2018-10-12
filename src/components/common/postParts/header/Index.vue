<template>
  <div class="post-header">
    <router-link class="avatar" :to="'/' + user.username">
      <img v-if="user.avatar" :src="user.avatar"/>
    </router-link>
    <router-link class="name" :to="'/' + user.username">{{ user.username }}</router-link>
    <template v-if="user.isVerified">
      <span class="verified-user"></span>
    </template>
    <span class="user-login">
      <router-link :to="'/' + user.username">{{ user.username }}</router-link>
    </span>
    <span class="post-dropdown-menu-btn" v-on:click="isShowDropdown = !isShowDropdown"></span>
    <Dropdown
      v-bind:class="{ hidden: !isShowDropdown }"
      :postId="postId"
      :userId="user.id"
      :from="from"
    ></Dropdown>
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
    from: {
      type: String,
      required: true
    }
  }
};
</script>
