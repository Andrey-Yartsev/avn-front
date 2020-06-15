<template>
  <div class="row">
    <div class="content-col">
      <div class="profile-btns-group">
        <div class="btns-user-activity" v-if="!isBlockedOn">
          <router-link
            class="btn-user-activity"
            :class="!page ? 'active' : ''"
            :to="`/${profile.username}/posts`"
          >
            <span class="value">{{ profile.postsCount }}</span>
            <span class="label">Posts</span>
          </router-link>
          <router-link
            class="btn-user-activity"
            :to="`/${profile.username}/photos`"
          >
            <span class="value">{{ profile.photosCount }}</span>
            <span class="label">Photos</span>
          </router-link>
          <router-link
            class="btn-user-activity"
            :to="`/${profile.username}/videos`"
          >
            <span class="value">{{ profile.videosCount }}</span>
            <span class="label">Videos</span>
          </router-link>
          <router-link
            v-if="isOwner(this.profile.id) || profile.linksCount > 0"
            class="btn-user-activity"
            :to="`/${profile.username}/links`"
          >
            <span class="value">{{
              isOwner(this.profile.id)
                ? this.$store.state.auth.user.linksCount
                : profile.linksCount
            }}</span>
            <span class="label">Links</span>
          </router-link>
          <router-link
            v-if="
              (isOwner(this.profile.id) || profile.mediaCount > 0) &&
                this.profile.storeEnabled
            "
            class="btn-user-activity"
            :to="`/${profile.username}/media`"
          >
            <span class="value">{{
              isOwner(this.profile.id)
                ? this.$store.state.auth.user.mediaCount
                : profile.mediaCount
            }}</span>
            <span class="label">Clips</span>
          </router-link>
        </div>
        <div class="profile-actions" v-if="isOwner(this.profile.id)">
          <router-link
            to="/settings/profile"
            class="profile-actions__btn btn-with-icon btn-edit-profile"
          >
            <span class="icn-item icn-profile icn-size_lg"></span>
            Edit profile
          </router-link>
          <button
            class="profile-actions__btn btn-with-icon make-post-btn make-post-btn_color-sec"
            @click="openAddPostModal"
          >
            <span class="icn-item icn-post icn-size_lg"></span>
            New post
          </button>
        </div>
        <div class="profile-actions" v-else>
          <template v-if="!isBlockedOn">
            <div
              v-if="$root.showTips"
              class="profile-actions-tip-form"
              :class="{ show: showTip }"
            >
              <Tip
                :user="profile"
                ref="tip"
                @cancel="closeTip"
                class="tip-form_profile"
              />
            </div>
            <button
              v-if="profile.canEarn && $root.showTips"
              type="button"
              class="profile-actions__btn btn-with-icon profile-tip-btn"
              @click="openTip"
            >
              <span class="icn-item icn-tips icn-size_lg"></span>
              Tip
            </button>
            <SubscribeButton
              :profile="profile"
              @requested="subsRequested"
              ref="subscribeButton"
            />
            <div
              class="subscribeView profile-actions__btn"
              v-if="
                !profile.subscribedBy ||
                  (profile.subscribedBy && profile.subscribedByProgress) ||
                  (profile.subscribedBy &&
                    !profile.subscribedByProgress &&
                    !profile.followedBy)
              "
            >
              <div
                v-if="profile.followedBy"
                @click="unfollow"
                class="btn-with-icon btn-subscribe disable-state"
                :disabled="followInProgress"
              >
                <span class="icn-item icn-userp"></span>
                <div class="btn-subscribe__label">
                  Unfollow
                </div>
              </div>
              <div
                v-else
                @click="follow"
                class="btn-with-icon btn-subscribe"
                :disabled="followInProgress"
              >
                <span class="icn-item icn-userp"></span>
                <div class="btn-subscribe__label">
                  Follow
                </div>
              </div>
            </div>
            <button
              v-if="profile.canWrite"
              @click="sendMessage"
              type="button"
              class="profile-actions__btn btn-with-icon profile-message-btn"
            >
              <span class="icn-msg icn-item icn-size_lg"></span>
              Message
            </button>
          </template>
          <UserDropdown
            v-if="user && $mq === 'desktop'"
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
import UserDropdown from "@/components/common/userDropdown/Index";
import ModalRouterGoto from "@/mixins/modalRouter/goto";

export default {
  name: "ProfileActions",
  mixins: [UserMixin, ModalRouterGoto],
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
    },
    followInProgress() {
      return (
        this.$store.state.profile.home._followLoading ||
        this.$store.state.profile.home._unfollowLoading
      );
    },
    isBlockedOn() {
      return !this.isOwner(this.profile.id) && this.profile.privacy.isBlockedOn;
      // return !this.isOwner(this.profile.id) && true;
    }
  },
  methods: {
    openAddPostModal() {
      this.$store.dispatch("modal/show", {
        name: "addPost"
      });
    },
    follow() {
      if (this.followInProgress) {
        return;
      }
      if (!this.user) {
        this.$store.commit("profile/home/setOnPageAction", "follow");
        this.$store.dispatch("modal/show", { name: "login" });
        return;
      }
      this.$store.dispatch("profile/home/follow", this.profile.id);
    },
    unfollow() {
      if (this.followInProgress) {
        return;
      }
      this.$store.dispatch("profile/home/unfollow", this.profile.id);
    },
    sendMessage() {
      this.goToModalRoute("chat/" + this.profile.id);
    },
    subsRequested(data) {
      if (!data.result.success) {
        return;
      }
      if (data.action === "unsubscribe") {
        this.unsubscribed();
      } else if (data.action === "resubscribe") {
        this.resubscribed();
      } else {
        // throw new Error("Wrong action");
      }
    },
    unsubscribed() {
      this.$store.dispatch("profile/home/extend", {
        subscribedByProgress: true
      });
      this.$store.dispatch("global/flashToast", {
        text: "You have unsubscribed successfully"
      });
      this.$store.commit("profile/home/resetPosts");
      this.$store.dispatch("profile/home/getPosts");
    },
    resubscribed() {
      this.$store.dispatch("profile/home/extend", {
        subscribedByProgress: false
      });
      this.$store.dispatch("global/flashToast", {
        text: "You have resubscribed successfully"
      });
      this.$store.commit("profile/home/resetPosts");
      this.$store.dispatch("profile/home/getPosts");
    },
    closeTip() {
      this.showTip = false;
      this.$refs.tip.reset();
    },
    openTip() {
      if (!this.user) {
        this.$store.commit("profile/home/setOnPageAction", "openTip");
        this.$store.dispatch("modal/show", { name: "login" });
        return;
      }
      this.showTip = true;
    }
  },
  watch: {
    funded() {
      this.closeTip();
    }
  },
  mounted() {
    let action;

    action = this.$store.state.profile.home.onLoginAction;

    if (action) {
      this.$store.commit("profile/home/resetOnLoginAction");
    }

    if (!action) {
      action = this.$store.state.profile.home.onPageAction;
    }

    if (action) {
      if (action === "subscribe" && this.$refs.subscribeButton) {
        this.$refs.subscribeButton.subscription();
        this.$store.commit("profile/home/resetOnPageAction");
        return;
      }
      this[action] && this[action]();
    }
  }
};
</script>
