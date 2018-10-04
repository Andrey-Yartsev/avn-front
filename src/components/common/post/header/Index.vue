<template>
    <div class="post-header">
        <router-link class="avatar" :to="user.publicUrl">
            <img :src="user.avatar" />
        </router-link>
        <router-link class="name" :to="user.publicUrl">{{ user.username }}</router-link>
        <span v-if="user.isVerified" class="verified-user"></span>
        <span class="user-login">
          <router-link :to="user.publicUrl">{{ user.username }}</router-link>
        </span>
        <span class="post-dropdown-menu-btn" @click="isShowDropdawn = !isShowDropdawn"></span>
        <Dropdawn v-bind:class="{ hidden: !isShowDropdawn }" :postId="postId" :userId="user.id" />
    </div>
</template>

<script>
import Dropdawn from "./Dropdawn";

export default {
  name: "Header",
  components: {
    Dropdawn: Dropdawn
  },
  data: () => ({
    isShowDropdawn: false
  }),
  props: {
    postId: {
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
