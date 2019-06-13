<template>
  <div class="loader-container" v-if="loading">
    <Loader :fullscreen="false" text="" class="transparent small" />
  </div>
  <div class="special-container" v-else>
    <router-link
      class="addPost-btn-float hidden-desktop"
      to="/addPost"
      v-if="isAuth()"
      ><span class="icn-item icn-post"></span
    ></router-link>
    <HeaderControl :profile="profile" v-if="$mq === 'mobile'" />
    <div class="white-bg-block">
      <ProfileBackground :profile="profile" />
      <div class="profile-images">
        <ProfileAvatar :profile="profile" :pageName="pageName" />
      </div>
      <div class="profile-header" v-if="useMediumPostView || $mq === 'mobile'">
        <div
          class="profile-name profile-name_base hidden-desktop"
          v-if="$mq === 'mobile'"
        >
          <div class="profile-name__main">
            <span class="name">{{ profile.name }}</span>
            <span
              class="verified-user icn-item"
              v-if="profile.isVerified"
            ></span>
            <div class="block-indicator" v-if="user && profile.isBlocked">
              <span class="icn-item icn-block"></span>
            </div>
          </div>
          <span class="user-login reset-ml">
            <a>{{ profile.username }}</a>
          </span>
        </div>
        <component :is="scrollableComponent" class="profile-desc">
          <p class="profile-text" v-if="profile.about">
            <span v-html="trunc(profile.about)"></span>
            <span class="collapse-text">
              <a
                v-if="profile.about.length > collapseLimit"
                href="#"
                @click.prevent="collapsed = !collapsed"
              >
                {{ collapsed ? "Read more" : "Collapse" }}
              </a>
            </span>
          </p>
          <a
            v-if="profile.twitterUsername && !profile.isPrivateTwitter"
            :href="'https://twitter.com/' + profile.twitterUsername"
            class="profile-twitter-link"
            target="_blank"
            rel="nofollow"
            >twitter.com/{{ profile.twitterUsername }}</a
          >
          <FollowersCounter :profile="profile" />
          <Highlights :userId="profile.id" v-if="$mq === 'desktop'" />
          <div class="mark-line" v-if="$mq === 'desktop'"></div>
          <Footer class="site-footer_sidebar" v-if="$mq === 'desktop'" />
        </component>
      </div>
      <div
        class="post-types-tabs"
        :style="{
          'margin-right': `${-scrollBarWidth}px`,
          'padding-right': `${scrollBarWidth}px`
        }"
        v-if="$mq === 'desktop'"
      >
        <div class="container">
          <ProfileActions
            :profile="profile"
            :page="pageName"
            ref="actionsDesktop"
          />
        </div>
      </div>
      <div class="profile-actions-mob" v-if="$mq === 'mobile'">
        <ProfileActions
          :profile="profile"
          :page="pageName"
          ref="actionsMobile"
        />
      </div>
      <div class="content-wrapper content-wrapper_cut">
        <Highlights
          :userId="profile.id"
          v-if="$mq === 'mobile' && isPostPage"
        />
        <div class="container">
          <div class="row">
            <div :class="['content-col', { 'single-col': !useMediumPostView }]">
              <p
                :class="['empty-feed']"
                v-if="!posts.length && !infinityScrollLoading"
              >
                <span>Nothing here yet</span>
                <button
                  v-if="isOwner(this.profile.id)"
                  @click="openAddPostModal"
                  type="button"
                  class="make-post-btn btn-with-icon btn-with-icon_lg feed"
                >
                  <span class="icn-item icn-post"></span>
                  Create new post
                </button>
              </p>
              <div class="profile-content">
                <div class="posts-container" v-if="useMediumPostView">
                  <PostCollection
                    :class="'rounded-container'"
                    :posts="posts"
                    from="profile/home"
                  />
                </div>
                <div class="exploreAllCollectionView" v-else>
                  <div class="explore">
                    <div class="explore__inside">
                      <div :class="['explore-wrapper', pageName]">
                        <component
                          :is="postComponent"
                          v-for="post in posts"
                          :post="post"
                          :key="post.id"
                          from="profile/home"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="loaderWrap loader-content"
                  v-if="infinityScrollLoading"
                >
                  <Loader :fullscreen="false" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer
      :class="[
        'site-footer_main hidden-footer',
        { 'page-width': !useMediumPostView }
      ]"
    />
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
import Highlights from "@/components/common/profile/highlights/Index";
import Wsp from "@/mixins/wsp";
import Footer from "@/components/footer/Index.vue";
import VuePerfectScrollbar from "vue-perfect-scrollbar";

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
    PostMedium,
    Highlights,
    VuePerfectScrollbar
  },

  data() {
    return {
      collapseLimit: 250,
      collapsed: true
    };
  },

  computed: {
    scrollableComponent() {
      return this.$mq === "mobile" ? "div" : VuePerfectScrollbar;
    },
    loading() {
      return this.$store.state.profile.home.fetchProfileLoading;
    },
    username() {
      return this.$route.params.username;
    },
    pageName() {
      return this.$route.params.page;
    },
    isPostPage() {
      return !this.pageName || this.pageName === "posts";
    },
    source() {
      return this.isPostPage ? "" : this.pageName;
    },
    footerPages() {
      return this.$store.state.common.pages;
    },
    profile() {
      return this.$store.state.profile.home.profile;
    },
    posts() {
      return this.$store.state.profile.home.posts;
    },
    store() {
      return this.$store.state.profile.home;
    },
    allMediaTypes() {
      return [...this.inputAcceptTypes.photo];
    },
    newPost() {
      return this.$store.state.post.newPost;
    },
    updatedPost() {
      return this.$store.state.post.updatedPost;
    },
    deletedPost() {
      return this.$store.state.profile.home.deletedPost;
    },
    postPinChanged() {
      return this.$store.state.profile.home.postPinChanged;
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
    highlights() {
      return this.$store.state.highlights.posts;
    },
    postComponent() {
      if (this.$mq === "mobile" && this.pageName === "videos") {
        return PostMedium;
      }

      return PostSmall;
    }
  },
  watch: {
    footerPages() {
      this.footerScrollAction();
    },
    username() {
      this.scrollToTop();
      this.initProfile();
    },
    pageName() {
      this.scrollToTop();
      this.footerScrollAction();
      this.initPosts();
    },
    newPost() {
      this.initPosts();
    },
    updatedPost() {
      this.$store.dispatch("profile/home/updatePost", this.updatedPost);
    },
    deletedPost() {
      this.initPosts();
      this.initProfile();
    },
    postPinChanged() {
      this.initPosts();
    },
    subscriptionUpdate(data) {
      if (this.$refs.actionsDesktop) {
        this.$refs.actionsDesktop.subsRequested(data);
      }
      if (this.$refs.actionsMobile) {
        this.$refs.actionsMobile.subsRequested(data);
      }
    },
    highlights() {
      this.footerScrollAction();
    },
    source() {
      // fix for infinity scroll. reset lastYOffset when switching tabs
      this.lastYOffset = 0;
    }
  },
  methods: {
    initProfile() {
      this.$store.commit("profile/home/resetPageState");
      this.$store.dispatch("profile/home/fetchProfile", this.username);
    },
    initContent() {
      this.footerScrollAction();
      this.initPosts();
    },
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
    },
    footerScrollAction() {
      const profileDataText = document.querySelector(".mark-line");

      if (!profileDataText) {
        return;
      }

      const {
        top: ftTop,
        height: ftHeight
      } = profileDataText.getBoundingClientRect();
      const footer = document.querySelector(".site-footer");
      const footerHeight = footer.getBoundingClientRect().height;

      const methodName =
        window.innerHeight - ftTop - ftHeight - 20 > footerHeight
          ? "add"
          : "remove";

      footer.classList[methodName]("site-footer_sticky-bottom");
    },
    trunc(text) {
      if (this.collapsed && this.profile.about.length > this.collapseLimit) {
        text = text.replace(/<br \/>/g, " ");
        return text.substring(0, this.collapseLimit) + "…";
      } else {
        return text;
      }
    },
    scrollToTop() {
      global.scrollTo(0, 0);
    }
  },
  created() {
    this.initContent();

    setTimeout(() => {
      this.$root.ws.send({
        act: "collect",
        message: "view_profile",
        data: {
          profile_id: this.profile.id,
          owner: this.profile.id,
          duration: 1
        }
      });
    }, 2000);
  },
  mounted() {
    this.scrollToTop();
    this.footerScrollAction();
    window.addEventListener("scroll", this.scrollAction, true);
    document.title = this.profile.name + " | AVN Stars";
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.scrollAction, true);
    document.title = "AVN Stars";
  }
};
</script>

<style scoped>
.loader-container {
  height: 300px;
}
</style>
