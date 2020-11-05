<template>
  <div class="loader-container loader-container_center" v-if="loading">
    <Loader :fullscreen="false" text :small="true" />
  </div>
  <div class="special-container" v-else>
    <router-link
      class="addPost-btn-float hidden-desktop icn-item icn-post icn-size_lg icn-pos_center"
      to="/addPost"
      v-if="isAuth() && $mq === 'mobile'"
    />
    <HeaderControl :profile="profile" v-if="$mq === 'mobile' && isAuth()" />
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
              :class="{
                fullyMonetized: profile.canEarn && profile.canPayoutsRequest
              }"
              v-if="
                profile.isVerified ||
                  (profile.canEarn && profile.canPayoutsRequest)
              "
            ></span>
            <div class="block-indicator" v-if="user && profile.isBlocked">
              <span class="icn-item icn-block"></span>
            </div>
            <button
              @click="clickVoteHandler"
              class="btn vote-btn"
              v-if="showVoteButton"
            >
              <span class="icn-award icn-item icn-size_lg" />
              Vote 4 Me!
            </button>
          </div>
          <span class="user-login reset-ml user-login-container">
            <a>{{ profile.username }}</a>
            <span v-if="showProfileRank" class="user-login user-login-rating">
              # {{ getModelRank }}
              <!-- # {{ profile.privacy.categoryRankCount }} -->
              <span
                v-if="isOwner(profile.id)"
                class="icn-item icn-locked icn-size_sm"
                :class="{ locked: !profile.privacy.showRankCount }"
              />
            </span>
          </span>
        </div>
        <component
          :is="scrollableComponent"
          class="profile-desc"
          ref="description"
        >
          <template v-if="!isBlockedOn">
            <p class="profile-text" v-if="profile.about">
              <span v-html="trunc(profile.about)"></span>
              <span
                class="collapse-text"
                v-if="profile.about.length > collapseLimit + collapseGap"
              >
                <a href="#" @click.prevent="collapsed = !collapsed">{{
                  collapsed ? "Read more" : "Collapse"
                }}</a>
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
            <div class="profile-offer" v-if="showProfileOffer">
              <button
                class="btn border alt btn_fix-width-lg"
                @click="buySnapchat"
                v-if="snapchat && snapchat.isPaid === false"
              >
                Premium Snapchat ${{ snapchat.price }}
              </button>
              <div
                class="profile-offer__chat"
                v-if="snapchat && snapchat.isPaid === true"
              >
                <div class="user-login reset-ml">
                  Snapchat:
                  <span class="name">{{ snapchat.content }}</span>
                </div>
                <div
                  class="profile-offer__form"
                  v-if="snapchat && snapchat.isCompleted === false"
                >
                  <input
                    type="text"
                    v-model="mysnapchat"
                    class="rounded"
                    placeholder="Enter your snapchat"
                  />
                  <button
                    class="btn"
                    @click="sendMySnapchat"
                    :disabled="!mysnapchat.trim()"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
            <FollowersCounter :profile="profile" />
            <Highlights :userId="profile.id" v-if="$mq === 'desktop'" />
          </template>
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
      <div
        class="content-wrapper content-wrapper_cut"
        :class="{
          'content-wrapper_all-height':
            $mq === 'desktop' && pageName === 'links'
        }"
      >
        <Highlights
          :userId="profile.id"
          v-if="$mq === 'mobile' && isPostPage"
        />
        <div class="container">
          <div class="row">
            <div :class="['content-col', { 'single-col': !useMediumPostView }]">
              <!-- <BlockedBlock v-if="true" :profile="profile" /> -->
              <BlockedBlock v-if="isBlockedOn" :profile="profile" />
              <PrivateBlock
                v-else-if="
                  !isOwner(profile.id) &&
                    profile.isPrivatePost &&
                    pageName !== 'media'
                "
                :profile="profile"
              />
              <FollowersOnlyBlock
                v-else-if="
                  !isOwner(profile.id) &&
                    !profile.isPrivatePost &&
                    (profile.privacy.forFollowersOnly && !profile.followedBy) &&
                    pageName !== 'media'
                "
                :profile="profile"
              />
              <LinksPage
                v-else-if="pageName === 'links' && !profile.isPrivatePost"
                :private="isOwner(profile.id)"
              />
              <MediaPage
                v-else-if="pageName === 'media'"
                :private="isOwner(profile.id)"
                :purchasedFiltersOnly="
                  (!isOwner(profile.id) && profile.isPrivatePost) ||
                    (!isOwner(profile.id) &&
                      !profile.isPrivatePost &&
                      (profile.privacy.forFollowersOnly && !profile.followedBy))
                "
              />
              <GroupsPage
                v-else-if="pageName === 'groups'"
                :isPrivate="isOwner(profile.id)"
              />
              <template v-else>
                <div class="profile-content">
                  <div class="posts-container" v-if="useMediumPostView">
                    <div
                      v-if="isOwner(profile.id)"
                      class="posts-container__stashPostSwitcher "
                    >
                      <div class="content-types">
                        <a
                          class="btn-user-activity"
                          :class="{ active: !showStashedPosts }"
                          @click.prevent="switchStashedPostsView"
                          href="#"
                        >
                          <span class="label">Published</span>
                        </a>
                        <a
                          class="btn-user-activity"
                          :class="{ active: showStashedPosts }"
                          @click.prevent="switchStashedPostsView"
                          href="#"
                        >
                          <span class="label">Stashed</span>
                        </a>
                      </div>
                      <button
                        v-if="showStashedPosts"
                        class="btn make-post-btn border alt btn_fix-width-sm"
                        type="button"
                        @click="openAddPostModal(true)"
                      >
                        <span class="icn-item icn-post icn-size_lg"></span>
                        Add
                      </button>
                      <div
                        v-if="showStashedPosts"
                        class="posts-container__stashPostSwitcher-settingsLink semi-transparent"
                      >
                        You can manage publication settings on
                        <router-link to="/settings/privacy"
                          >privacy</router-link
                        >
                        page
                      </div>
                    </div>
                    <PostCollection
                      :class="'rounded-container'"
                      :posts="posts"
                      from="profile/home"
                      v-if="posts.length"
                      @visibilityChanged="visibilityChanged"
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
                            @visibilityChanged="visibilityChanged"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    class="loader-infinity"
                    v-if="infinityScrollLoading && pageName !== 'links'"
                  >
                    <Loader :fullscreen="false" :inline="true" :small="true" />
                  </div>
                </div>
                <p
                  :class="['empty-feed']"
                  v-if="
                    !posts.length &&
                      !infinityScrollLoading &&
                      pageName !== 'links'
                  "
                >
                  <span>Nothing here yet</span>
                  <button
                    v-if="
                      isOwner(profile.id) &&
                        pageName !== 'links' &&
                        !showStashedPosts
                    "
                    @click="openAddPostModal(false)"
                    type="button"
                    class="make-post-btn make-post-btn_feed make-post-btn_color-sec btn-with-icon btn-with-icon_lg"
                  >
                    <span class="icn-item icn-post"></span>
                    Create new post
                  </button>
                </p>
              </template>
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
import PostCollection from "@/components/post/collection/Index";
import PostSmall from "@/components/post/view/SmallView";
import PostMedium from "@/components/post/view/MediumView";
import ProfileAvatar from "@/components/common/profile/avatar/Index";
import InfinityScrollMixin from "@/mixins/infinityScroll";
import Visibility from "@/mixins/post/visibility";
import UserMixin from "@/mixins/user";
import FileUpload from "@/mixins/fileUpload";
import HeaderControl from "@/components/common/profile/headerControl/Index";
import FollowersCounter from "@/components/common/profile/followersCounter/Index";
import ProfileBackground from "@/components/common/profile/background/Index";
import ProfileActions from "@/components/common/profile/actions/Index";
import PrivateBlock from "@/components/common/profile/privateBlock/Index";
import FollowersOnlyBlock from "@/components/common/profile/followersOnlyBlock/Index";
import BlockedBlock from "@/components/common/profile/blockedBlock/Index";
import Highlights from "@/components/common/profile/highlights/Index";
import Wsp from "@/mixins/wsp";
import Footer from "@/components/footer/Index.vue";
import LinkPost from "@/components/addLink/LinkPost";
import LinksPage from "@/components/common/profile/links/Index";
import MediaPage from "@/components/common/profile/media/Index";
import GroupsPage from "@/components/common/profile/groups/Index";
import TipAuto from "@/mixins/tipAuto";
import VotingMixin from "@/mixins/voting";

export default {
  name: "ProfileHome",

  mixins: [
    InfinityScrollMixin,
    UserMixin,
    FileUpload,
    Wsp,
    Visibility,
    TipAuto,
    VotingMixin
  ],

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
    PrivateBlock,
    FollowersOnlyBlock,
    BlockedBlock,
    Highlights,
    LinkPost,
    LinksPage,
    MediaPage,
    GroupsPage
  },

  data() {
    return {
      collapseLimit: 200,
      collapseGap: 150,
      collapsed: true,
      mysnapchat: "",
      descrInitHeight: 0,
      showStashedPosts: false
    };
  },

  computed: {
    scrollableComponent() {
      return this.$mq === "mobile" ? "div" : "perfect-scrollbar";
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
      return (
        this.pageName === undefined ||
        this.pageName === "posts" ||
        this.pageName === "links"
      );
    },
    highlights() {
      return this.$store.state.highlights.posts;
    },
    postComponent() {
      if (this.$mq === "mobile" && this.pageName === "videos") {
        return PostMedium;
      }
      // if (this.pageName === "links") {
      //   return LinkPost;
      // }

      return PostSmall;
    },
    snapchat() {
      //if user has not a snapchat an empty array is coming from server
      if (Array.isArray(this.profile.snapchat)) {
        return this.profile.snapchat.length > 0
          ? this.profile.snapchat[0]
          : null;
      }
      return this.profile.snapchat;
    },
    showProfileOffer() {
      return this.snapchat && !this.isOwner(this.profile.id);
    },
    showProfileRank() {
      // if (!this.isAdmin) {
      //   return false;
      // }
      if (!this.profile.privacy.categoryRankCount) {
        return false;
      }
      return (
        (this.isOwner(this.profile.id) && this.isMonetizedUser) ||
        (this.profile.privacy && this.profile.privacy.showRankCount)
      );
    },
    isAdmin() {
      return (
        this.$store.state.auth.user &&
        this.$store.state.auth.user.privacy.isAdmin
      );
    },
    getModelRank() {
      if (
        !this.$store.state.auth.user ||
        this.$store.state.auth.user.categoryView === 1
      ) {
        return this.profile.privacy.globalRankCount;
      }
      return this.profile.privacy.categoryRankCount;
    },
    isBlockedOn() {
      return !this.isOwner(this.profile.id) && this.profile.privacy.isBlockedOn;
      // return !this.isOwner(this.profile.id) && true;
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
      this.showStashedPosts = false;
      this.$store.commit("profile/home/switchStashedPostView", { reset: true });
      if (this.pageName !== "links" && this.pageName !== "media") {
        this.initPosts();
      }
    },
    newPost() {
      this.$store.dispatch("modal/hide", { name: "editPost" });
      this.initPosts();
    },
    updatedPost() {
      this.$store.dispatch("profile/home/updatePost", this.updatedPost);
    },
    deletedPost(post) {
      if (post.mediaType === "photo") {
        this.$store.dispatch("profile/home/extend", {
          photosCount: this.$store.state.profile.home.profile.photosCount - 1
        });
      }
      if (post.mediaType === "video") {
        this.$store.dispatch("profile/home/extend", {
          videosCount: this.$store.state.profile.home.profile.videosCount - 1
        });
      }
      this.$store.dispatch("profile/home/extend", {
        postsCount: this.$store.state.profile.home.profile.postsCount - 1
      });
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
    },
    posts() {
      // console.log(this.posts.length);
      for (let i = 0; i < this.posts.length; i++) {
        if (this.posts[i].isVisible === undefined) {
          this.posts[i].isVisible = true;
        }
      }
    },
    $route() {
      this.$nextTick(() => {
        if (
          this.$refs.description &&
          this.$refs.description.$el &&
          !this.descrInitHeight
        ) {
          this.descrInitHeight = this.$refs.description.$el.getBoundingClientRect().height;
        }
      });
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
    openAddPostModal(isStashed = false) {
      this.$store.dispatch("modal/show", {
        name: "addPost",
        data: {
          isStashed
        }
      });
    },
    infinityScrollGetDataMethod() {
      if (this.profile) {
        this.getPosts();
      }
    },
    getPosts() {
      if (
        this.$route.params.page !== "links" &&
        this.$route.params.page !== "media" &&
        this.$route.params.page !== "groups"
      ) {
        this.$store.dispatch("profile/home/getPosts");
      }
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
      if (
        this.collapsed &&
        this.profile.about.length > this.collapseLimit + this.collapseGap
      ) {
        text = text.replace(/<br \/>/g, " ");
        return text.substring(0, this.collapseLimit) + "…";
      } else {
        return text;
      }
    },
    scrollToTop() {
      global.scrollTo(0, 0);
    },
    buySnapchat() {
      if (process.env.VUE_APP_NAME === "avn") {
        if (!this.user) {
          this.$store.dispatch("modal/show", {
            name: "signup"
          });
          return;
        }

        if (!this.snapchat || this.snapchat.isPaid !== false) {
          return;
        }

        // if (!this.user.isPaymentCardConnected) {
        //   this.$store.dispatch("global/flashToast", {
        //     text: "You should add card in payment settings",
        //     type: "warning"
        //   });
        //   this.$router.push("/settings/payments");
        //   return;
        // }

        this.$store.dispatch("modal/show", {
          name: "buySnapchatConfirm",
          data: {
            price: "$" + this.snapchat.price,
            paymentType: "product",
            productId: this.snapchat.id,
            callback: this.initProfile
          }
        });
      }
    },
    sendMySnapchat() {
      if (!this.snapchat || this.snapchat.isPaid === false) {
        return;
      }
      if (process.env.VUE_APP_NAME === "avn") {
        this.$store
          .dispatch("chat/sendMessage", {
            userId: this.profile.id,
            data: {
              price: 0,
              text: this.$store.state.init.data.messages.snapchatSuccessPaid.replace(
                "{SNAPCHAT}",
                this.mysnapchat
              ),
              isSnapchat: true
            }
          })
          .then(() => {
            this.$store
              .dispatch(`premiumLinks/activate`, {
                id: this.snapchat.id,
                data: {
                  name: this.mysnapchat
                }
              })
              .then(() => {
                // console.log(r);
                this.$router.push(`/chat/${this.profile.id}`);
              });
          });
      }
    },
    storePrefix() {
      return "profile/home";
    },
    scrollAction() {
      if (!this.$refs.description || !this.$refs.description.$el) {
        return;
      }
      if (window.pageYOffset < 250) {
        this.$refs.description.$el.style.height =
          this.descrInitHeight + window.pageYOffset + "px";
      } else if (this.$refs.description.$el.style.height !== "") {
        this.$refs.description.$el.style.height = "";
      }
    },
    switchStashedPostsView() {
      this.showStashedPosts = !this.showStashedPosts;
      this.$store.commit("profile/home/switchStashedPostView", {
        reset: false
      });
      this.$nextTick(() => {
        this.initPosts();
      });
    }
  },
  created() {
    this.initContent();
    if (this.profile) {
      this.$store.dispatch("gender/initProfile", this.profile);
    }
    setTimeout(() => {
      if (!this.profile) {
        return;
      }
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
    if (this.$mq === "desktop") {
      window.addEventListener("scroll", this.scrollAction, true);
      this.$nextTick(() => {
        if (this.$refs.description && this.$refs.description.$el) {
          this.descrInitHeight = this.$refs.description.$el.getBoundingClientRect().height;
        }
      });
    }
    document.title = this.profile.name + " | AVN Stars";
    window.snapchat = this.snapchat;
  },
  beforeDestroy() {
    if (this.$mq === "desktop") {
      window.removeEventListener("scroll", this.scrollAction, true);
    }
    document.title = "AVN Stars";
    this.$store.commit("profile/home/switchStashedPostView", { reset: true });
  }
};
</script>
