<template>
  <div class="item" v-if="actionPrefix === 'earnings'">
    <div class="index table__cell">
      {{ num }}
    </div>
    <div class="user table__cell">
      <router-link :to="'/' + profile.user.username" class="userview-block">
        <span class="avatar avatar_sm">
          <span class="avatar__img">
            <img :src="profile.user.avatar" v-if="profile.user.avatar" />
          </span>
        </span>
        <div class="name">{{ profile.user.name }}</div>
        <span class="user-login reset-ml">{{ profile.user.username }}</span>
      </router-link>
    </div>
    <div class="signed table__cell table__cell_align table__cell_align-hor-c">
      {{ messageTime(profile.sinceDate) }}
    </div>
    <div class="spend table__cell table__cell_align table__cell_align-hor-c">
      ${{ profile.amount.day }}
    </div>
    <div class="spend table__cell table__cell_align table__cell_align-hor-c">
      ${{ profile.amount.week }}
    </div>
    <div class="spend table__cell table__cell_align table__cell_align-hor-c">
      ${{ profile.amount.month }}
    </div>
    <div class="spend table__cell table__cell_align table__cell_align-hor-c">
      ${{ profile.amount.lifetime }}
    </div>
  </div>
</template>

<script>
import SubscribeButton from "./SubscribeButton";
import FollowButton from "../pages/search/FollowButton";
import UserDropdown from "@/components/common/userDropdown/Index";
import User from "@/mixins/user";
import truncate from "truncate-html";
import { fromNow } from "@/helpers/datetime";

export default {
  name: "User",
  mixins: [User],
  components: {
    SubscribeButton,
    FollowButton,
    UserDropdown
  },
  data: function() {
    return {
      showDropdown: false
    };
  },
  props: {
    profile: {
      type: Object,
      required: true
    },
    actionPrefix: {
      type: String,
      required: true
    },
    top: {
      type: Boolean,
      default: false
    },
    num: {
      type: Number
    }
  },
  computed: {},
  methods: {
    truncate(v) {
      return truncate(v, 150);
    },
    messageTime(message) {
      return fromNow(message);
    }
  }
};
</script>

<style lang="scss" scoped></style>
