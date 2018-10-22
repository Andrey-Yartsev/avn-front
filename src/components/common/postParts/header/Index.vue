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
    <div :class="['more-functions', {open: opened}]"  v-click-outside="hide">
      <div class="more-functions__overlay"></div>
      <div class="more-functions__btn" @click="opened = true">
        <div class="more-functions__btn-text"></div>
      </div>
      <div class="more-functions__dropdown">
        <Dropdown
          :postId="postId"
          :userId="user.id"
          :from="from"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Dropdown from "./Dropdown";
import ClickOutside from "vue-click-outside";

export default {
  name: "Header",
  components: {
    Dropdown
  },
  data: () => ({
    opened: false
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
  },
  methods: {
    hide() {
      this.opened = false;
    }
  },
  mounted() {
    this.popupItem = this.$el.querySelector(".more-functions");
  },
  directives: {
    ClickOutside
  }
};
</script>
