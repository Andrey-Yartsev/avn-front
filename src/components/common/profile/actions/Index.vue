<template>
  <div class="row">
    <div class="content-col">
      <div class="profile-btns-group">
        <div class="btns-user-activity">
          <router-link :class="!page ? 'active' : ''" :to="`/${profile.username}/posts`">
            <span class="value">{{ profile.postsCount }}</span>
            <span class="label">Posts</span>
          </router-link>
          <router-link :to="`/${profile.username}/photos`">
            <span class="value">{{ profile.photosCount }}</span>
            <span class="label">Photos</span>
          </router-link>
          <router-link :to="`/${profile.username}/videos`">
            <span class="value">{{ profile.videosCount }}</span>
            <span class="label">Videos</span>
          </router-link>
        </div>
        <div class="profile-actions" v-if="isOwner(this.profile.id)">
          <router-link to="/settings/profile" class="btn-edit-profile">Edit profile</router-link>
          <button class="btn-make-post make-post-btn" @click="openAddPostModal">New post</button>
        </div>
        <div class="profile-actions" v-else>
          <div class="profile-actions-tip-form" :class="{show: showTip}">
            <Tip
              :user="profile"
              ref="tip"
              @cancel="closeTip"
            />
          </div>
          <button
            v-if="profile.canEarn"
            type="button" class="profile-actions__btn profile-tip-btn selected"
            @click="showTip = true"
          >Fund</button>
          <SubscribeButton :profile="profile" @requested="subsRequested"/>
          <div class="subscribeView">
            <div
              v-if="profile.followedBy"
              @click="unfollow"
              class="profile-actions__btn btn-subscribe disable-state">
              <div class="btn-subscribe__label">
                Unfollow
              </div>
            </div>
            <div
              v-else
              @click="follow"
              class="profile-actions__btn btn-subscribe">
              <div class="btn-subscribe__label">
                Follow
              </div>
            </div>
          </div>
          <button
            v-if="profile.followedBy"
            @click="sendMessage"
            type="button" 
            class="profile-actions__btn profile-message-btn"
          >
            Message
          </button>
          <UserDropdown
            class="profile-actions__btn profile-more-functions more-functions_with-text hidden-mobile"
            :profile="profile"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UserMixin from "@/mixins/user";
import Tip from "@/components/common/tip/User";
import SubscribeButton from "@/components/subscription/Button";
import UserDropdown from "@/components/common/userDropdawn/Index";

export default {
  name: "ProfileActions",
  mixins: [UserMixin],
  data() {
    return {
      showTip: false
    };
  },
  components: {
    Tip,
    SubscribeButton,
    UserDropdown
  },
  props: {
    profile: {
      type: Object,
      required: true
    },
    page: {
      type: String,
      default: ""
    }
  },
  computed: {
    funded() {
      return this.$store.state.tip.funded;
    }
  },
  methods: {
    openAddPostModal() {
      this.$store.dispatch("modal/show", {
        name: "addPost"
      });
    },
    follow() {
      if (this.user) {
        this.$store.dispatch("profile/home/follow", this.profile.id);
      } else {
        this.$router.push("/login");
      }
    },
    unfollow() {
      this.$store.dispatch("profile/home/unfollow", this.profile.id);
    },
    sendMessage() {
      this.$router.push("/chat/" + this.profile.id);
    },
    subsRequested(data) {
      if (data.action === "unsubscribe") {
        this.unsubscribed(data.result);
      } else if (data.action === "resubscribe") {
        this.resubscribed(data.result);
      } else {
        throw new Error("Wrong action");
      }
    },
    unsubscribed(result) {
      if (!result.success) {
        return;
      }
      this.$store.dispatch("profile/home/extend", {
        subscribedByExpire: true
      });
      this.$store.dispatch(
        "global/flashToast",
        "You have unsubscribed successfully"
      );
    },
    resubscribed(result) {
      if (!result.success) {
        return;
      }
      this.$store.dispatch("profile/home/extend", {
        subscribedByExpire: false
      });
      this.$store.dispatch(
        "global/flashToast",
        "You have resubscribed successfully"
      );
    },
    closeTip() {
      this.showTip = false;
      this.$refs.tip.reset();
    }
  },
  watch: {
    funded() {
      this.closeTip();
    }
  }
};
</script>
