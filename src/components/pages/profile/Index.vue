<template>
  <div class="loader-container" v-if="loading">
    <Loader :fullscreen="false" text="" class="transparent small"/>
  </div>
  <div class="profile" v-else>
    <router-link class="addPost-btn-float" to="/addPost"/>
    <HeaderControl :profile="profile"/>
    <div class="white-bg-block">
      <div class="profile-sticky-header">
        <ProfileBackground :profile="profile"/>
        <div class="profile-header-container">
          <div class="profile-images">
            <ProfileAvatar :profile="profile" :pageName="pageName" />
          </div>
          <div class="profile-header" v-if="useMediumPostView">
            <div class="profile-name profile-name_base hidden-desktop">
              <div class="profile-name__main">
                <span class="name">{{ profile.name }}</span>
                <span class="verified-user" v-if="profile.isVerified"></span>
              </div>
              <span class="user-login"><a>{{ profile.username }}</a></span>
            </div>
            <div class="profile-desc">
              <p class="profile-text" v-if="profile.about" v-html="profile.about"></p>
              <a
                v-if="profile.twitterUsername"
                :href="'https://twitter.com/' + profile.twitterUsername"
                class="profile-twitter-link" target="_blank"
                rel="nofollow"
              >twitter.com/{{ profile.twitterUsername }}</a>
              <FollowersCounter :profile="profile"/>
            </div>
            <Footer class="site-footer_sidebar hidden-mobile" />
          </div>
        </div>
        <div
          class="post-types-tabs"
          v-bind:style="{
            'margin-right': -scrollBarWidth + 'px',
            'padding-right': scrollBarWidth + 'px'
          }">
          <div class="container">
            <ProfileActions
              :profile="profile"
              :page="pageName"
              ref="actionsDesktop"
            />
          </div>
        </div>
      </div>
      <div class="profile-actions-mob">
        <ProfileActions
          :profile="profile"
          :page="pageName"
          ref="actionsMobile"
        />
      </div>
      <div class="container">
        <div class="row">
          <div :class="['content-col', {'single-col': !useMediumPostView}]">
            <p :class="['empty-feed', { hidden: posts.length }]">
              <span>Nothing here yet</span>
              <button
                v-if="isOwner(this.profile.id)"
                @click="openAddPostModal"
                type="button"
                class="make-post-btn feed"
              >
                Create new post
              </button>
            </p>
            <div class="posts-container">
              <PostCollection
                v-if="useMediumPostView"
                :class="'rounded-container'"
                :posts="posts"
                from="profile/home"
              />
              <div class="exploreAllCollectionView" v-else>
                <div class="explore-wrapper all">
                  <component
                    :is="postComponent"
                    v-for="post in posts"
                    :post="post"
                    :key="post.id" 
                    from="profile/home"
                  />
                </div>
              </div>
              <div class="loaderWrap loader-content" v-if="infinityScrollLoading">
                <Loader :fullscreen="false" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer :class="['site-footer_main hidden-footer', {'page-width': !useMediumPostView}]" />
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";
import PostCollection from "@/components/common/postCollection/Index";
import PostSmall from "@/components/post/SmallView";
import PostMedium from "@/components/post/MediumView";
import ProfileAvatar from "@/components/common/profile/avatar/Index";
import InfinityScrollMixin from "@/mixins/infinityScroll";
import UserMixin from "@/mixins/user";
import FileUpload from "@/mixins/fileUpload";
import HeaderControl from "@/components/common/profile/headerControl/Index";
import FollowersCounter from "@/components/common/profile/followersCounter/Index";
import ProfileBackground from "@/components/common/profile/background/Index";
import ProfileActions from "@/components/common/profile/actions/Index";
import Wsp from "@/mixins/wsp";
import Footer from "@/components/footer/Index.vue";

export default {
  name: "ProfileHome",

  mixins: [InfinityScrollMixin, UserMixin, FileUpload, Wsp],

  components: {
    Loader,
    PostCollection,
    ProfileAvatar,
    FollowersCounter,
    HeaderControl,
    ProfileBackground,
    ProfileActions,
    Footer,
    PostSmall,
    PostMedium
  },

  data() {
    return {
      showTip: false
    };
  },

  computed: {
    loading() {
      return this.$store.state.profile.home.fetchProfileLoading;
    },
    username() {
      return this.$route.params.username;
    },
    pageName() {
      return this.$route.params.page;
    },
    source() {
      if (!this.pageName || this.pageName === "posts") {
        return "";
      }

      return this.pageName;
    },
    profile() {
      return this.$store.state.profile.home.profile;
    },
    posts() {
      return this.$store.state.profile.home.posts;
    },
    postLoading() {
      return this.$store.state.profile.home.loading;
    },
    store() {
      return this.$store.state.profile.home;
    },
    deletedPost() {
      return this.$store.state.profile.home.deletedPost;
    },
    allMediaTypes() {
      return [...this.inputAcceptTypes.photo];
    },
    updatedPost() {
      return this.$store.state.post.updatedPost;
    },
    scrollBarWidth() {
      if (!this.$store.state.global.modalOpened) {
        return 0;
      }
      return this.$store.state.global.scrollBarWidth;
    },
    subscriptionUpdate() {
      return this.$store.state.subscription.updated;
    },
    useMediumPostView() {
      return this.pageName === undefined || this.pageName === "posts";
    },
    postComponent() {
      if (this.$mq === "mobile" && this.pageName === "videos") {
        return PostMedium;
      }

      return PostSmall;
    }
  },
  watch: {
    username() {
      this.$store.commit("profile/home/resetPageState");
      this.$store
        .dispatch("profile/home/fetchProfile", this.username)
        .then(() => {
          this.initPosts();
        });
    },
    pageName() {
      this.lastYOffset = 0;
      this.initPosts();
    },
    deletedPost() {
      this.$store.dispatch("profile/home/fetchProfile", this.username);
    },
    updatedPost() {
      this.$store.dispatch("profile/home/updatePost", this.updatedPost);
    },
    subscriptionUpdate(data) {
      this.$refs.actionsDesktop.subsRequested(data);
    }
  },
  methods: {
    initPosts() {
      this.$store.commit("profile/home/resetPosts");
      this.$store.dispatch("profile/home/setSource", this.source);
      this.getPosts();
    },
    openAddPostModal() {
      this.$store.dispatch("modal/show", {
        name: "addPost"
      });
    },
    infinityScrollGetDataMethod() {
      if (this.profile) {
        this.getPosts();
      }
    },
    getPosts() {
      this.$store.dispatch("profile/home/getPosts");
    }
  },
  created() {
    this.initPosts();
  }
};
</script>

<style scoped>
.loader-container {
  height: 300px;
}
</style>
