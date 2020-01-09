<template>
  <div class="loader-container loader-container_center" v-if="!profile">
    <Loader :fullscreen="false" text="" :small="true" />
  </div>
  <div class="special-container" v-else>
    <router-link
      class="addPost-btn-float hidden-desktop icn-item icn-post icn-size_lg icn-pos_center"
      to="/addPost"
      v-if="isAuth() && $mq === 'mobile'"
    />
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
            <router-link
              to="/likes"
              class="content-nav__item"
              v-if="isOwner(profile.id)"
            >
              Likes {{ profile.favoritesCount }}
            </router-link>
          </div>
          <div class="row">
            <div class="content-col single-col">
              <div class="posts-container">
                <div
                  class="sticky-header-controls header-mobile"
                  v-if="$mq === 'mobile'"
                >
                  <a
                    class="header-return-btn go-back go-back_arrow header-return-btn_icn-abs"
                    :href="`/`"
                    @click.prevent="goBack"
                  />
                  <h1 class="page-title">Likes</h1>
                </div>
                <div class="explore">
                  <div class="feed-wrapper">
                    <div :class="{ 'block-bg': !loading && posts.length }">
                      <PostCollection
                        :posts="posts"
                        from="favPosts"
                        @visibilityChanged="visibilityChanged"
                      />

                      <div
                        class="loader-infinity"
                        :class="{ 'loader-infinity_collapsed': !posts.length }"
                        v-if="infinityScrollLoading"
                      >
                        <Loader
                          :fullscreen="false"
                          :inline="true"
                          :class="{ small: posts.length }"
                        />
                      </div>
                      <div
                        class="msg-no-content show"
                        v-if="!loading && !posts.length"
                      >
                        <div class="msg-no-content__text">
                          Like posts to see them here
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
    </div>
    <Footer class="site-footer_main" />
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";
import InfinityScrollMixin from "@/mixins/infinityScroll";
import UserMixin from "@/mixins/user";
import SubscribeButton from "@/components/subscription/Button";
import ProfileAvatar from "@/components/common/profile/avatar/Index";
import HeaderControl from "@/components/common/profile/headerControl/Index";
import ProfileBackground from "@/components/common/profile/background/Index";
import FollowersCounter from "@/components/common/profile/followersCounter/Index";
import UserDropdown from "@/components/common/userDropdown/Index";
import ProfileActions from "@/components/common/profile/actions/Index";
import Footer from "@/components/footer/Index";
import PostCollection from "@/components/post/collection/Index";
import PostVisibility from "@/mixins/post/visibility";
import BackRouter from "@/utils/backRouter";

export default {
  name: "FavPosts",
  mixins: [InfinityScrollMixin, UserMixin, PostVisibility],
  components: {
    Loader,
    PostCollection,
    SubscribeButton,
    ProfileAvatar,
    HeaderControl,
    ProfileBackground,
    FollowersCounter,
    UserDropdown,
    ProfileActions,
    Footer
  },
  computed: {
    loading() {
      return this.$store.state.favPosts.loading;
    },
    deletedPost() {
      return this.$store.state.favPosts.deletedPost;
    },
    page() {
      return this.$route.meta.title;
    },
    profile() {
      return this.user;
    },
    posts() {
      return this.$store.state.favPosts.posts;
    },
    store() {
      return this.$store.state.favPosts;
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
      this.$store.commit("favPosts/resetPageState");
      this.getPosts();
    },
    infinityScrollGetDataMethod() {
      if (this.profile) {
        this.getPosts();
      }
    },
    getPosts() {
      this.$store.dispatch("favPosts/getPosts");
    },
    openAddPostModal() {
      this.$store.dispatch("modal/show", {
        name: "addPost"
      });
    },
    storePrefix() {
      return "favPosts";
    },
    goBack() {
      BackRouter.back();
    }
  },
  watch: {
    deletedPost() {
      this.$store.commit("favPosts/resetPageState");
      this.$store.dispatch("profile/fetch");
    }
  },
  created() {
    this.init();
  }
};
</script>
