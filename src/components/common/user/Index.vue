<template>
    <div class="userView" :class="[{'open-dropdown-inside': showDropdawn}]">
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
                    <UserDropdown :profile="v" @openDropdawn="showDropdawn = true" @hideDropdawn="showDropdawn = false" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import SubscribeButton from "@/components/pages/search/SubscribeButton";
import FollowButton from "@/components/pages/search/FollowButton";
import UserDropdown from "@/components/common/userDropdawn/Index";

export default {
  name: "User",
  data: function() {
    return {
      showDropdawn: false
    };
  },
  props: ["v"],

  components: {
    SubscribeButton,
    FollowButton,
    UserDropdown
  }
};
</script>
