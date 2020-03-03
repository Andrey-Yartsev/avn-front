<template>
  <div class="exploreView">
    <MobileHeader v-if="$mq === 'mobile'"></MobileHeader>
    <router-link
      class="addPost-btn-float hidden-desktop icn-item icn-post icn-size_lg icn-pos_center"
      v-if="$mq === 'mobile' && isAuth()"
      to="/addPost"
    />
    <div class="container">
      <div class="over-container">
        <Navigate />
        <div
          class="stories-wrapper stories-all"
          v-if="stories.length || lives.length"
        >
          <div class="storyCollectionView storyCollectionView_tape">
            <div class="stories-group__outer">
              <div class="stories-group">
                <TopLives :lives="lives" v-if="lives.length" />
                <perfect-scrollbar
                  class="stories-group__inner"
                  @ps-scroll-x="scrollFunction"
                >
                  <StorySmall
                    v-for="post in stories"
                    :post="post"
                    :key="post.id"
                    from="explore"
                    :stories="stories"
                  />
                </perfect-scrollbar>
              </div>
            </div>
          </div>
        </div>
        <div class="explore">
          <div
            :class="{
              exploreAllCollectionView: page === 'all',
              photoCollectionView: page === 'photos',
              videoCollectionView: page === 'videos',
              storyCollectionView: page === 'stories',
              liveCollectionView: page === 'lives',
              userCollectionView: page === 'topmodels'
            }"
          >
            <Users
              v-if="page === 'topmodels'"
              :items="topModels"
              actionPrefix="topModels"
              :top="true"
            />
            <div v-else-if="page === 'feed'" class="feed-wrapper">
              <PostCollection
                :posts="posts"
                from="explore"
                @visibilityChanged="visibilityChanged"
              />
            </div>
            <div v-else :class="['explore-wrapper', page]">
              <template v-if="type === 'media'">
                <template v-if="page === 'store'">
                  <component
                    :is="mediaComponent"
                    v-for="post in posts"
                    :post="post"
                    :key="post.id"
                    from="explore"
                  />
                </template>
                <template v-else>
                  <component
                    :is="postComponent"
                    v-for="post in posts"
                    :post="post"
                    :key="post.id"
                    from="explore"
                    :shouldBePoster="page === 'all' && post.id === firstVideoId"
                    @visibilityChanged="visibilityChanged"
                  />
                </template>
              </template>
              <template v-if="page === 'stories'">
                <StoryMedium
                  v-for="post in stories"
                  :post="post"
                  :key="post.id"
                  from="explore"
                  :stories="stories"
                />
              </template>
              <template v-if="page === 'lives'">
                <Live
                  v-for="post in lives"
                  :post="post"
                  :key="post.id"
                  from="explore"
                  :updatePageData="getPageData"
                />
              </template>
            </div>
            <div class="loader-infinity" v-if="infinityScrollLoading">
              <Loader :fullscreen="false" :inline="true" />
            </div>
            <div class="msg-no-content show" v-if="shouldShowNoPosts">
              <div class="msg-no-content__text">
                <template v-if="page !== 'lives'">
                  No {{ contentName }} here yet
                </template>
                <template v-else>
                  No live streams for now
                </template>
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
import MobileHeader from "@/components/header/Mobile";
import Footer from "@/components/footer/Index.vue";
import TopLives from "@/components/common/topLives/Index";
import PostSmall from "@/components/post/view/SmallView";
import PostMedium from "@/components/post/view/MediumView";
import StoryMedium from "@/components/story/MediumView";
import StorySmall from "@/components/story/SmallView";
import Users from "@/components/users/Users";
import UserMixin from "@/mixins/user";
import Live from "@/components/stream/MediumView";
import Navigate from "./navigate/Index";
import InfinityScrollMixin from "@/mixins/infinityScroll";
import Visibility from "@/mixins/post/visibility";
import Loader from "@/components/common/Loader";
import PostsStat from "@/mixins/post/statMany";
import PostCollection from "@/components/post/collection/Index";
import uniqBy from "lodash.uniqby";
import GenderFilter from "@/components/common/GenderFilter";
import MediaMedium from "@/components/common/profile/media/views/MediaMedium";
import MediaSmall from "@/components/common/profile/media/views/MediaSmall";

export default {
  name: "Explore",
  components: {
    MobileHeader,
    Footer,
    TopLives,
    Navigate,
    PostSmall,
    PostMedium,
    StoryMedium,
    StorySmall,
    Users,
    Live,
    Loader,
    PostCollection,
    GenderFilter,
    MediaMedium,
    MediaSmall
  },
  mixins: [UserMixin, InfinityScrollMixin, PostsStat, Visibility],
  created() {
    this.init();
  },
  computed: {
    firstVideoId() {
      const videos = this.posts.filter(item => item.mediaType === "video");
      return !!videos.length && videos[0].id;
    },
    posts() {
      return this.$store.state.explore.posts;
    },
    stories() {
      return this.$store.state.stories.explore.posts;
    },
    lives() {
      return uniqBy(this.$store.state.lives.posts, "id");
    },
    topModels() {
      return this.$store.state.topModels.posts;
    },
    storiesLoading() {
      return this.$store.state.stories.loading;
    },
    storiesAllDataReceived() {
      return this.$store.state.stories.allDataReceived;
    },
    store() {
      // uses into InfinityScrollMixin
      if (this.type === "media") {
        return this.$store.state.explore;
      }

      if (this.type === "story") {
        return this.$store.state.stories.explore;
      }

      if (this.type === "live") {
        return this.$store.state.lives;
      }

      if (this.type === "top") {
        return this.$store.state.topModels;
      }

      if (this.type === "feed") {
        return this.$store.state.explore;
      }
    },
    contentName() {
      if (this.type === "media") {
        return "posts";
      }

      if (this.type === "story") {
        return "stories";
      }

      if (this.type === "live") {
        return "lives";
      }

      if (this.type === "top") {
        return "models";
      }
    },
    shouldShowNoPosts() {
      const { loading, posts } = this.store;
      return !loading && !posts.length;
    },
    page() {
      return this.$route.meta.page;
    },
    type() {
      return this.$route.meta.type;
    },
    source() {
      if (this.page === "all") {
        return "media";
      }

      return this.page;
    },
    postComponent() {
      if (this.$mq === "mobile" && this.page === "videos") {
        return PostMedium;
      }
      return PostSmall;
    },
    mediaComponent() {
      return this.$mq === "mobile" ? MediaMedium : MediaSmall;
    },
    category() {
      return this.$store.state.gender.category;
    },
    userViewIsAll() {
      return this.user.categoryView === 1;
    },
    userViewIsStreight() {
      return this.user.categoryView === 2;
    },
    userViewIsGay() {
      return this.user.categoryView === 3;
    },
    isEnableVoting() {
      return this.$store.state.init.data.enableVoting;
    },
    isEnableGayVoting() {
      return this.$store.state.init.data.enableGayVoting;
    }
  },
  methods: {
    init() {
      this.getPageData();
    },
    scrollFunction(e) {
      if (!e) return;

      const { scrollWidth, scrollLeft, offsetWidth } = e.srcElement;
      const scrolledEnought = scrollWidth - (offsetWidth + scrollLeft) < 600;
      if (
        scrolledEnought &&
        !this.storiesLoading &&
        !this.storiesAllDataReceived
      ) {
        this.$store.dispatch("stories/explore/getPosts");
      }
    },
    infinityScrollGetDataMethod() {
      // uses into InfinityScrollMixin
      if (this.type === "media" || this.type === "feed") {
        this.$store.dispatch("explore/getPosts");
      }

      if (this.type === "story") {
        this.$store.dispatch("stories/explore/getPosts");
      }

      if (this.type === "live") {
        this.$store.dispatch("lives/getPosts");
      }

      if (this.type === "top") {
        this.$store.dispatch("topModels/getPosts");
      }
    },
    getPageData() {
      this.lastYOffset = 0;

      this.$store.dispatch("explore/resetPageState");
      this.$store.dispatch("lives/resetPageState");
      this.$store.commit("topModels/reset");

      const searchTag = this.$route.params.tag;
      if (searchTag) {
        this.$store.commit("explore/setTag", searchTag);
      }

      if (this.type === "media" || this.type === "feed") {
        this.$store.dispatch("explore/setSource", { source: this.source });
        this.$store.dispatch("explore/getPosts");
      }

      this.$store.dispatch("lives/getPosts");

      this.$store.dispatch("stories/explore/resetPageState");
      this.$store.dispatch("stories/explore/setLimit", { limit: 20 });
      this.$store.dispatch("stories/explore/getPosts");

      if (this.type === "top") {
        this.$store.dispatch("topModels/getPosts");
      }

      if (this.type === "live") {
        this.$store.dispatch("lives/getPosts");
      }
    },
    storePrefix() {
      return "explore";
    }
  },
  watch: {
    page() {
      this.postsStatFinishViewAction();
      this.getPageData();
    },
    category() {
      this.getPageData();
    },
    ["$route.params.tag"]() {
      this.init();
    }
  }
};
</script>
