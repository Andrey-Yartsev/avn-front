<template>
  <div class="loader-container" v-if="!profile">
    <Loadr :fullscreen="false" text="" class="transparent small" />
  </div>
  <div class="profile" v-else>
    <router-link class="addPost-btn-float" to="/addPost"/>
    <HeaderControl :profile="profile" />
    <div class="white-bg-block">
      <div class="profile-sticky-header">
        <ProfileBackground  :profile="profile" />
        <div class="profile-header-container">
          <div class="profile-images">
            <ProfileAvatar :profile="profile" />
          </div>
        </div>
        <div class="post-types-tabs" v-bind:style="{ 'margin-right': -scrollBarWidth + 'px', 'padding-right': scrollBarWidth + 'px' }">
          <div class="container">
            <ProfileActions
              :profile="profile"
              :page="page"
            />
          </div>
          <div class="profile-name-sticky hidden-mobile">
            <div class="profile-name profile-name_base">
              <div class="profile-name__main">
                <span class="name">
                  {{ profile.name }}
                </span>
                <span class="verified-user" v-if="profile.isVerified"></span>
              </div>
              <span class="user-login">
                <router-link :to="'/' + profile.username">{{ profile.username }}</router-link>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="content-nav hidden-mobile">
        <router-link to="/following" class="content-nav__item">Following {{ profile.followingCount }}</router-link>
        <router-link to="/followers" class="content-nav__item">Followers {{ profile.followersCount }}</router-link>
      </div>
      <div class="container">
        <div class="row">
          <div class="content-col">
            <div class="posts-container">
              <div class="sticky-header-controls header-mobile">
                <router-link class="header-return-btn" :to="`/${profile.username}`" />
                <h1 class="page-title">Following</h1>
              </div>
              <div class="explore">
                <div class="userCollectionView">
                  <Users
                    :items="users"
                    :loading="false"
                    :query="page"
                  />
                  <div class="loaderWrap loader-content" v-if="infinityScrollLoading || !allDataReceived">
                    <Loader :fullscreen="false" />
                  </div>
                  <div class="msg-no-content" v-if="!loading && !user.length">
                    <div class="msg-no-content__text" v-if="page === 'following'">Start following people to see them here</div>
                    <div class="msg-no-content__text" v-else>No one follows you yet</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";
import InfinityScrollMixin from "@/mixins/infinityScroll";
import UserMixin from "@/mixins/user";
import SubscribeButton from "@/components/subscription/Button";
import Users from "@/components/pages/search/types/Users.vue";
import ProfileAvatar from "@/components/common/profile/avatar/Index";
import HeaderControl from "@/components/common/profile/headerControl/Index";
import ProfileBackground from "@/components/common/profile/background/Index";
import FollowersCounter from "@/components/common/profile/followersCounter/Index";
import UserDropdown from "@/components/common/userDropdawn/Index";
import ProfileActions from "@/components/common/profile/actions/Index";

export default {
  name: "Followers",
  mixins: [InfinityScrollMixin, UserMixin],
  components: {
    Loader,
    Users,
    SubscribeButton,
    ProfileAvatar,
    HeaderControl,
    ProfileBackground,
    FollowersCounter,
    UserDropdown,
    ProfileActions
  },

  data: () => ({
    loadingName: "followersRequestLoading",
    showTip: false
  }),
  computed: {
    loading() {
      return this.$store.state.followers.followersRequestLoading;
    },
    page() {
      return this.$route.meta.title;
    },
    profile() {
      return this.user;
    },
    users() {
      return this.$store.state.followers.posts;
    },
    store() {
      return this.$store.state.followers;
    },
    allMediaTypes() {
      return [...this.inputAcceptTypes.photo];
    },
    scrollBarWidth() {
      if (!this.$store.state.global.modalOpened) {
        return 0;
      }
      return this.$store.state.global.scrollBarWidth;
    },
    scrollBarInitWidth() {
      return this.$store.state.global.scrollBarInitWidth;
    }
  },
  methods: {
    init() {
      this.$store.commit("followers/reset");
      this.getPosts();
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
    infinityScrollGetDataMethod() {
      if (this.profile) {
        this.getPosts();
      }
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
    getPosts() {
      this.$store.dispatch("followers/getPosts", { type: this.page });
    },
    openAddPostModal() {
      this.$store.dispatch("modal/show", {
        name: "addPost"
      });
    }
  },
  watch: {
    page() {
      this.init();
    }
  },
  created() {
    this.init();
  }
};
</script>
