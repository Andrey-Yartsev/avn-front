<template>
  <div class="feed">
    <MobileHeader v-if="$mq === 'mobile'"></MobileHeader>
    <router-link
      class="addPost-btn-float hidden-desktop icn-item icn-post icn-size_lg icn-pos_center"
      v-if="$mq === 'mobile'"
      to="/addPost"
    />
    <div class="container">
      <div class="row">
        <div
          class="content-col flex-basis-auto"
          :class="{ 'new-user': newUser, destopView: $mq === 'desktop' }"
        >
          <div class="no-padding rounded-container shadow-block">
            <AddPost
              v-if="$mq === 'desktop'"
              where="home"
              type="new"
              :class="{ 'round-borders': !posts.length }"
            />
            <NewFeedPostToast :init="init" :newPosts="newPosts" />
            <div class="feed reset-btr">
              <PostCollection
                :posts="posts"
                from="home"
                @visibilityChanged="visibilityChanged"
              />
            </div>
            <div v-if="newUser" class="start-feed-page">
              <div class="start-feed-page__text">
                <router-link to="/explore">Find</router-link> someone to follow
                <br />or
                <router-link to="/addPost">Start sharing</router-link>right away
              </div>
              <div class="start-feed-page__logo logo">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 54 51">
                  <g id="Layer_2" data-name="Layer 2">
                    <g id="Layer_1-2" data-name="Layer 1">
                      <path
                        d="M48.12,36.15a4.43,4.43,0,0,1-4.2,3.52H7.3c-5.79,0-5.88,3.84-6.84,3.84A.44.44,0,0,1,0,43.09.28.28,0,0,1,0,43L7.06,3.53A4.43,4.43,0,0,1,11.26,0H51a2.87,2.87,0,0,1,3,2.91,3.34,3.34,0,0,1-.06.62Z"
                        class="cls-1"
                      />
                      <path
                        d="M14.74,3.85a.56.56,0,0,0-.6-.53H11.55a.6.6,0,0,0-.63.53l-5.82,32a.76.76,0,0,0,0,.15c0,.26.14.39.44.39H8.24a.62.62,0,0,0,.64-.54l.76-4.33a.62.62,0,0,1,.64-.54h5.09a.58.58,0,0,1,.64.54l.81,4.33a.55.55,0,0,0,.59.54h2.72c.29,0,.43-.13.43-.39a.76.76,0,0,0,0-.15Zm-.05,23.24H11c-.31,0-.46-.11-.46-.33a.59.59,0,0,1,0-.21l2-11.39a.21.21,0,0,1,.22-.18.2.2,0,0,1,.21.18l2.08,11.39a.71.71,0,0,1,0,.14C15.13,27,15,27.09,14.69,27.09ZM32.34,3.71c0-.26-.15-.39-.44-.39H29.18a.55.55,0,0,0-.59.53L24.81,24.54a.23.23,0,0,1-.25.18c-.12,0-.17-.06-.17-.18L20.65,3.85A.64.64,0,0,0,20,3.32H17.3c-.3,0-.45.12-.45.35a.57.57,0,0,0,0,.18l5.81,32a.56.56,0,0,0,.59.54h2.59a.65.65,0,0,0,.64-.54l5.82-32C32.33,3.8,32.34,3.76,32.34,3.71Zm17.33-.39H46.79a.6.6,0,0,0-.65.53L42.36,24.63a.27.27,0,0,1-.27.23c-.08,0-.12-.05-.12-.14L38.16,3.85a.58.58,0,0,0-.62-.53H35a.58.58,0,0,0-.61.53L28.61,35.8a1.41,1.41,0,0,0,0,.18c0,.27.14.4.43.4H31.9a.61.61,0,0,0,.65-.58L36.33,15a.27.27,0,0,1,.21-.22q.14,0,.18.18l3.8,20.91a.55.55,0,0,0,.63.49h2.51a.58.58,0,0,0,.61-.54l5.81-32a.89.89,0,0,0,0-.15C50.1,3.44,50,3.32,49.67,3.32Z"
                        class="cls-2"
                      />
                      <path
                        d="M2.68,49.89a.59.59,0,0,1,.18-.37l.32-.37a.53.53,0,0,1,.37-.21.58.58,0,0,1,.31.11,2.4,2.4,0,0,0,1.54.59s1.38,0,1.38-1.07c0-1.3-3.16-1.18-3.16-3.2a3,3,0,0,1,3.17-2.74c1.17,0,2.15.55,2.15.92a.63.63,0,0,1-.13.34l-.27.38a.47.47,0,0,1-.39.25.62.62,0,0,1-.29-.09A2.24,2.24,0,0,0,6.53,44S5.12,44,5.12,45c0,1.27,3.18,1.1,3.18,3.16A2.94,2.94,0,0,1,5.16,51a3.6,3.6,0,0,1-2.34-.82A.42.42,0,0,1,2.68,49.89Z"
                      />
                      <path
                        d="M14.06,44H11.88c-.27,0-.41-.12-.41-.34a.69.69,0,0,1,0-.13l0-.32a.53.53,0,0,1,.57-.48h5.82c.26,0,.39.13.39.35a.57.57,0,0,1,0,.13l-.06.32a.51.51,0,0,1-.55.47H15.52L14.4,50.38a.51.51,0,0,1-.56.48h-.51c-.27,0-.4-.11-.4-.34a.71.71,0,0,1,0-.14Z"
                      />
                      <path
                        d="M22.93,43.15a.65.65,0,0,1,.61-.39h.73a.41.41,0,0,1,.46.39L26,50.32a.37.37,0,0,1,0,.11c0,.26-.18.43-.49.43H25a.4.4,0,0,1-.46-.38l-.28-1.69H21.41l-.85,1.67a.62.62,0,0,1-.61.4h-.52c-.25,0-.37-.1-.37-.27a.51.51,0,0,1,.08-.27Zm1.17,4.44-.34-2.17c-.05-.46-.09-1.25-.09-1.25h0s-.32.79-.54,1.25L22,47.59Z"
                      />
                      <path
                        d="M30.19,43.24a.53.53,0,0,1,.55-.48h2.2a3.41,3.41,0,0,1,1.5.22,1.73,1.73,0,0,1,1,1.69,3,3,0,0,1-1.78,2.74v0a2.22,2.22,0,0,1,.19.42l.91,2.44a.51.51,0,0,1,0,.2c0,.23-.18.37-.47.37h-.62a.47.47,0,0,1-.5-.33l-1-2.69H30.84l-.45,2.54a.51.51,0,0,1-.55.48h-.52c-.27,0-.4-.11-.4-.34a.71.71,0,0,1,0-.14Zm2.2,3.32A1.52,1.52,0,0,0,33.92,45a.79.79,0,0,0-.47-.8A1.73,1.73,0,0,0,32.6,44H31.51l-.44,2.53Z"
                      />
                      <path
                        d="M37.51,49.89a.57.57,0,0,1,.19-.37l.31-.37a.53.53,0,0,1,.38-.21.58.58,0,0,1,.3.11,2.4,2.4,0,0,0,1.54.59c.05,0,1.39,0,1.39-1.07,0-1.3-3.17-1.18-3.17-3.2a3,3,0,0,1,3.18-2.74c1.16,0,2.14.55,2.14.92a.56.56,0,0,1-.13.34l-.27.38a.47.47,0,0,1-.39.25.62.62,0,0,1-.29-.09A2.24,2.24,0,0,0,41.37,44C41.31,44,40,44,40,45c0,1.27,3.17,1.1,3.17,3.16A2.94,2.94,0,0,1,40,51a3.62,3.62,0,0,1-2.34-.82A.42.42,0,0,1,37.51,49.89Z"
                      />
                    </g>
                  </g>
                </svg>
              </div>
            </div>
          </div>
          <div
            class="loader-infinity loader-infinity-relative"
            v-if="infinityScrollLoading"
          >
            <Loader
              :fullscreen="false"
              :inline="true"
              :small="$mq === 'mobile'"
            />
          </div>
        </div>
        <div
          class="aside-col aside-col_sticky aside-col_sticky-al-bottom aside-col_with-footer"
        >
          <StoriesWrapper />
          <Footer v-if="$mq === 'desktop'"></Footer>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PostCollection from "@/components/post/collection/Index";
import NewFeedPostToast from "@/components/common/newFeedPostToast/Index";
import MobileHeader from "@/components/header/Mobile";
import Footer from "@/components/footer/Index";
import AddPost from "@/components/post/add/Fake";
import StoriesWrapper from "@/components/aside/StoriesWrapper";
import InfinityScrollMixin from "@/mixins/infinityScroll";
import WsMixin from "@/mixins/ws";
import Loader from "@/components/common/Loader";
import PostVisibility from "@/mixins/post/visibility";

export default {
  name: "HomePage",
  components: {
    MobileHeader,
    Footer,
    StoriesWrapper,
    AddPost,
    PostCollection,
    NewFeedPostToast,
    Loader
  },
  mixins: [InfinityScrollMixin, WsMixin, PostVisibility],
  created() {
    this.init();
  },
  computed: {
    newPosts() {
      return this.$store.state.home.newFeedPosts;
    },
    posts() {
      return this.$store.state.home.posts;
    },
    store() {
      // uses into InfinityScrollMixin
      return this.$store.state.home;
    },
    newPost() {
      return this.$store.state.post.newPost;
    },
    updatedPost() {
      return this.$store.state.post.updatedPost;
    },
    newUser() {
      return !this.posts.length && !this.infinityScrollLoading;
    },
    subscriptionUpdate() {
      return this.$store.state.subscription.updated;
    },
    genderCategory() {
      return this.$store.state.gender.category;
    }
  },
  methods: {
    storePrefix() {
      return "home";
    },
    infinityScrollGetDataMethod() {
      // uses into InfinityScrollMixin
      this.$store.dispatch("home/getPosts");
    },
    init() {
      this.$store.dispatch("home/resetPageState");
      this.$store.dispatch("home/getPosts");

      this.$store.dispatch("stories/feed/resetPageState");
      this.$store.dispatch("stories/feed/setLimit", { limit: 100 });
      this.$store.dispatch("stories/feed/getPosts");

      this.$store.dispatch("lives/resetPageState");
      this.$store.dispatch("lives/setSource", { source: "feed" });
      this.$store.dispatch("lives/setLimit", { limit: 100 });
      this.$store.dispatch("lives/getPosts");
    }
  },
  mounted() {
    this.$root.$on("homePageReload", this.init);
  },
  beforeDestroy() {
    this.$root.$off("homePageReload", this.init);
  },
  watch: {
    ["$route.params.tag"]() {
      this.init();
    },
    newPost() {
      this.$store.dispatch("modal/hide", { name: "addPost" });
      this.$store.dispatch("modal/hide", { name: "editPost" });
      this.init();
    },
    updatedPost() {
      this.$store.dispatch("home/updatePost", this.updatedPost);
    },
    subscriptionUpdate() {
      this.init();
    },
    genderCategory() {
      this.init();
    }
  }
};
</script>
