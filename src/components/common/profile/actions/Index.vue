<template>
  <div class="row">
    <div class="content-col">
      <div class="profile-btns-group">
        <div class="btns-user-activity">
          <router-link
            :class="!page ? 'active' : ''"
            :to="`/${profile.username}/posts`"
          >
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
          <router-link
            to="/settings/profile"
            class="profile-actions__btn btn-with-icon btn-with-icon_st btn-edit-profile"
            >Edit profile</router-link
          >
          <button
            class="profile-actions__btn btn-with-icon btn-with-icon_st btn-make-post make-post-btn"
            @click="openAddPostModal"
          >
            New post
          </button>
        </div>
        <div class="profile-actions" v-else>
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
            class="profile-actions__btn btn-with-icon btn-with-icon_st profile-tip-btn selected"
            @click="openTip"
          >
            Fund
          </button>
          <SubscribeButton
            :profile="profile"
            @requested="subsRequested"
            ref="subscribeButton"
          />
          <div
            class="subscribeView profile-actions__btn"
            v-if="!profile.subscribedBy"
          >
            <div
              v-if="profile.followedBy"
              @click="unfollow"
              class="btn-with-icon btn-with-icon_st btn-subscribe disable-state"
            >
              <div class="btn-subscribe__label">
                Unfollow
              </div>
            </div>
            <div
              v-else
              @click="follow"
              class="btn-with-icon btn-with-icon_st btn-subscribe"
            >
              <div class="btn-subscribe__label">
                Follow
              </div>
            </div>
          </div>
          <button
            v-if="profile.followedBy"
            @click="sendMessage"
            type="button"
            class="profile-actions__btn btn-with-icon btn-with-icon_st profile-message-btn"
          >
            Message
          </button>
          <UserDropdown
            v-if="user"
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
    }
  },
  methods: {
    openAddPostModal() {
      this.$store.dispatch("modal/show", {
        name: "addPost"
      });
    },
    follow() {
      if (!this.user) {
        this.$store.dispatch("modal/show", {
          name: "login",
          data: {
            profilePageAction: "follow"
          }
        });
        return;
      }
      this.$store.dispatch("profile/home/follow", this.profile.id);
    },
    unfollow() {
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
        throw new Error("Wrong action");
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
        this.$store.dispatch("modal/show", {
          name: "login",
          data: {
            profilePageAction: "openTip"
          }
        });
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
    const action = this.$store.state.modal.login.data.profilePageAction;
    if (action) {
      if (action === "subscribe") {
        this.$refs.subscribeButton.subscription();
        return;
      }
      this[action]();
    }
  }
};
</script>
