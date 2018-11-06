<template>
  <div class="users">
      <div class="userView" v-for="v in items" v-bind:key="v.id">
        <div class="bg"><img v-if="v.header" :src="v.header"/></div>
        <div class="user-container">
          <div class="avatar"><img v-if="v.avatar" :src="v.avatar"/></div>
          <div class="names-actions-wrapper">
            <div class="user-names">
              <div class="wrap-name">
                <router-link :to="'/' + v.username" class="name">{{ v.name }}</router-link>
              </div>
              <span class="user-login">
                <router-link :to="'/' + v.username">{{ v.username }}</router-link>
              </span>
            </div>
            <div class="user-actions">
              <SubscribeButton :profile="v" />
              <FollowButton :profile="v" />
              <UserDropdown :profile="v" />
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import SubscribeButton from "../SubscribeButton";
import FollowButton from "../FollowButton";
import UserDropdown from "../UserDropdown";

export default {
  name: "SearchUsers",

  props: ["items", "query", "loading"],

  components: {
    SubscribeButton,
    FollowButton,
    UserDropdown
  }
};
</script>
