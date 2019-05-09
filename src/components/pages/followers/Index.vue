<template>
  <div class="loader-container" v-if="!profile">
    <Loader :fullscreen="false" text="" class="transparent small" />
  </div>
  <div class="special-container" v-else>
    <router-link class="addPost-btn-float" to="/addPost" />
    <div class="white-bg-block">
      <ProfileBackground :profile="profile" v-if="$mq === 'desktop'" />
      <div class="profile-images" v-if="$mq === 'desktop'">
        <ProfileAvatar :profile="profile" :pageName="page" />
      </div>
      <div
        class="post-types-tabs"
        :style="{
          'margin-right': `${-scrollBarWidth}px`,
          'padding-right': `${scrollBarWidth}px`
        }"
      >
        <div class="container">
          <ProfileActions :profile="profile" :page="page" />
        </div>
      </div>
      <div class="content-wrapper">
        <div class="container">
          <div class="content-nav hidden-mobile" v-if="$mq === 'desktop'">
            <router-link to="/following" class="content-nav__item"
              >Following {{ profile.followingCount }}</router-link
            >
            <router-link to="/followers" class="content-nav__item"
              >Followers {{ profile.followersCount }}</router-link
            >
          </div>
          <div class="row">
            <div class="content-col">
              <div class="posts-container">
                <div class="sticky-header-controls header-mobile">
                  <router-link
                    class="header-return-btn go-back go-back_arrow header-return-btn_icn-abs"
                    :to="`/${profile.username}`"
                  />
                  <h1 class="page-title">Following</h1>
                </div>
                <div class="explore">
                  <div class="userCollectionView">
                    <Users
                      :items="users"
                      :loading="false"
                      :query="page"
                      actionPrefix="followers"
                    />
                    <div
                      class="loaderWrap loader-content"
                      v-if="infinityScrollLoading"
                    >
                      <Loader :fullscreen="false" />
                    </div>
                    <div class="msg-no-content" v-if="!loading && !user.length">
                      <div
                        class="msg-no-content__text"
                        v-if="page === 'following'"
                      >
                        Start following people to see them here
                      </div>
                      <div class="msg-no-content__text" v-else>
                        No one follows you yet
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer class="site-footer_main" />
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";
import InfinityScrollMixin from "@/mixins/infinityScroll";
import UserMixin from "@/mixins/user";
import SubscribeButton from "@/components/subscription/Button";
import Users from "@/components/users/Users.vue";
import ProfileAvatar from "@/components/common/profile/avatar/Index";
import HeaderControl from "@/components/common/profile/headerControl/Index";
import ProfileBackground from "@/components/common/profile/background/Index";
import FollowersCounter from "@/components/common/profile/followersCounter/Index";
import UserDropdown from "@/components/common/userDropdawn/Index";
import ProfileActions from "@/components/common/profile/actions/Index";
import Footer from "@/components/footer/Index";

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
    ProfileActions,
    Footer
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
        subscribedByProgress: true
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
        subscribedByProgress: false
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
