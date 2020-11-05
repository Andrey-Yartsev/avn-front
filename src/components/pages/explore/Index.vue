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
          v-if="stories.length || streamLives.length"
        >
          <div class="newStoriesLabel">New Stories</div>
          <div class="storyCollectionView storyCollectionView_tape">
            <div class="stories-group__outer">
              <div class="stories-group">
                <perfect-scrollbar
                  class="stories-group__inner"
                  @ps-scroll-x="scrollFunction"
                >
                  <TopLivesList
                    :lives="streamLives"
                    v-if="streamLives.length"
                  />
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
        <template v-if="page === 'clips'">
          <div class="stories-wrapper stories-all clipCategories">
            <span class="clipCategories_item">
              <router-link to="/explore/clips/all">
                All
              </router-link>
            </span>
            <span class="clipCategories_item">
              <router-link to="/explore/clips/free">
                Free Only
              </router-link>
            </span>
            <span class="clipCategories_item">
              <router-link to="/explore/clips/topView">
                Top Viewed
              </router-link>
            </span>
            <span class="clipCategories_item">
              <router-link to="/explore/clips/topSale">
                Best Selling
              </router-link>
            </span>
          </div>
          <div
            v-if="$route.params.category === 'all'"
            class="clipCategories_selector"
          >
            <div
              class="form-group categories"
              :class="{ mobile: $mq === 'mobile' }"
            >
              <div class="form-group-inner">
                <span class="label">Categories:</span>
                <div class="row">
                  <div
                    :class="{
                      'col-1-2': $mq === 'desktop',
                      'col-1-1': $mq === 'mobile'
                    }"
                  >
                    <span class="form-group form-group_clear-gaps">
                      <span class="form-field">
                        <multiselect
                          v-model="selectedClipCategory"
                          :options="clipCategories"
                          :multiple="false"
                          :close-on-select="true"
                          :clear-on-select="false"
                          :preserve-search="true"
                          placeholder="Select category"
                          label="title"
                          track-by="name"
                          :taggable="false"
                          :openDirection="$mq === 'desktop' ? 'bottom' : ''"
                        >
                        </multiselect>
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <div class="explore">
          <!-- <div class="row-btn" v-if="!infinityScrollLoading">
            <router-link
              :to="getVoteLinkHref"
              class="btn border block alt lg"
              v-if="!user"
            >
              <span
                class="icn-item icn-size_lg"
                :class="isGayPage ? 'icn-gayvn' : 'icn-avn'"
              ></span>
              {{ getVoteLinkText }}
            </router-link>
            <template v-else>
              <router-link
                to="/avn_awards/voting"
                class="btn border block alt lg"
                v-if="isEnableVoting && (userViewIsAll || userViewIsStreight)"
              >
                <span class="icn-item icn-avn icn-size_lg"></span>
                AVN Awards Voting
              </router-link>
              <router-link
                to="/gayvn_awards/voting"
                class="btn border block alt lg"
                v-if="isEnableGayVoting && (userViewIsAll || userViewIsGay)"
              >
                <span class="icn-item icn-gayvn icn-size_lg"></span>
                GayVN Awards Voting
              </router-link>
            </template>
          </div> -->
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
            <template v-if="page === 'topmodels'">
              <div class="form-group form-group_with-label month-options">
                <label class="form-group-inner">
                  <span class="label">Top models results</span>
                  <div class="row">
                    <div class="">
                      <div class="select-wrapper">
                        <select
                          name="selectedMonth"
                          class="default-disabled"
                          v-model="selectedMonth"
                        >
                          <option value="0">Current month</option>
                          <option
                            v-for="month in prevMonths"
                            :key="month.value"
                            :value="month.value"
                          >
                            {{ month.name }}
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
              <div
                v-if="category === 1"
                class="title-subtext text-centered semi-transparent"
              >
                Select preferred view content category to Straight or to Gay
                Gays to see top models prizes
              </div>
              <Users :items="topModels" actionPrefix="topModels" :top="true" />
            </template>
            <div v-else-if="page === 'feed'" class="feed-wrapper">
              <PostCollection
                :posts="posts"
                from="explore"
                @visibilityChanged="visibilityChanged"
              />
            </div>
            <div v-else :class="['explore-wrapper', page]">
              <template v-if="type === 'media'">
                <template v-if="page === 'clips'">
                  <component
                    :is="mediaComponent"
                    v-for="post in posts"
                    :post="post"
                    :key="post.id"
                    from="explore"
                    :showPin="false"
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
                <template v-for="post in lives">
                  <PostSmall
                    v-if="post.media"
                    :post="post"
                    :key="post.id"
                    from="explore"
                    :shouldBePoster="page === 'all' && post.id === firstVideoId"
                    @visibilityChanged="visibilityChanged"
                    :recordIcon="true"
                  />
                  <Live
                    v-else
                    :post="post"
                    :key="post.id"
                    from="explore"
                    :updatePageData="getPageData"
                  />
                </template>
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
import TopLivesList from "@/components/common/topLives/livesList";
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
import RouteRedirectMixin from "@/mixins/routeRedirect";
import Multiselect from "vue-multiselect";
// import mockStories from "@/mock/stories";

const defaultSelectedClipCategory = { id: 0, name: "All", title: "All" };

export default {
  name: "Explore",
  components: {
    MobileHeader,
    Footer,
    TopLives,
    TopLivesList,
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
    MediaSmall,
    Multiselect
  },
  mixins: [
    UserMixin,
    InfinityScrollMixin,
    PostsStat,
    Visibility,
    RouteRedirectMixin
  ],
  data() {
    return {
      storiesFetched: false,
      livesFetched: false,
      selectedMonth: 0,
      prevMonths: [],
      selectedClipCategory: defaultSelectedClipCategory
    };
  },
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
      // return mockStories;
      return this.$store.state.stories.explore.posts;
    },
    lives() {
      return uniqBy(this.$store.state.lives.posts, "id");
    },
    streamLives() {
      return this.lives.filter(item => !!item.user);
    },
    topModels() {
      return this.$store.state.topModels.posts;
    },
    storiesLoading() {
      return this.$store.state.stories.explore.loading;
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
    isGayPage() {
      return window.location.hostname.match(/gayvn/);
    },
    getVoteLinkHref() {
      return this.isGayPage ? "/gayvn_awards/voting" : "/avn_awards/voting";
    },
    getVoteLinkText() {
      return this.isGayPage ? "GayVN Awards Voting" : "AVN Awards Voting";
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
    },
    clipCategories() {
      let list = this.$store.state.explore.clipCategories.map(item => {
        const transformedName = item.name.replace(/&amp;/g, "&");
        return {
          id: item.id,
          name: transformedName,
          title: `${transformedName} (${item.amount})`
        };
      });
      list.sort((a, b) => {
        return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
      });
      list.unshift({ id: "0", name: "All", title: "All" });
      return list;
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
        if (this.page === "clips") {
          this.$store.dispatch("explore/getPosts", {
            filter: this.$route.params.category,
            clipCategory: this.selectedClipCategory.id
          });
        } else {
          this.$store.dispatch("explore/getPosts");
        }
      }

      if (this.type === "story") {
        this.$store.dispatch("stories/explore/getPosts");
      }

      if (this.type === "live") {
        this.$store.dispatch("lives/getPostsWithStreams");
      }

      if (this.type === "top") {
        this.$store.dispatch("topModels/getPosts", {
          month: this.selectedMonth
        });
      }
    },
    getPageData() {
      this.lastYOffset = 0;
      this.selectedMonth = 0;

      this.$store.dispatch("explore/resetPageState");
      this.$store.commit("topModels/reset");

      if (this.type === "media" || this.type === "feed") {
        this.$store.dispatch("explore/setSource", { source: this.source });
        if (this.page === "clips") {
          if (
            this.$route.params.category === "all" &&
            !this.$store.state.explore.clipCategories.length
          ) {
            this.$store.dispatch("explore/getClipCategories", {
              category: this.category
            });
          }
          this.$store.dispatch("explore/getPosts", {
            filter: this.$route.params.category,
            clipCategory: this.selectedClipCategory.id
          });
        } else {
          this.$store.dispatch("explore/getPosts");
        }
      }

      if (this.type === "story" || !this.storiesFetched) {
        this.$store.dispatch("stories/explore/resetPageState");
        this.$store.dispatch("stories/explore/setLimit", { limit: 20 });
        this.$store.dispatch("stories/explore/getPosts");
        this.storiesFetched = true;
      }

      if (this.type === "top") {
        this.$store.dispatch("topModels/getPosts", {
          month: this.selectedMonth
        });
      }

      if (!this.livesFetched) {
        this.$store.dispatch("lives/resetPageState");
        this.$store.dispatch("lives/getPosts");
        this.livesFetched = true;
      }
      if (this.type === "live") {
        this.$store.dispatch("lives/getPostsWithStreams");
      }
    },
    storePrefix() {
      return "explore";
    },
    initPrevMonths() {
      let dateStart = new Date("2020-08-28");
      let dateEnd = new Date();
      const months = [];

      while (dateStart.getMonth() !== dateEnd.getMonth()) {
        let month = dateStart.getMonth() + 1;
        if (month < 10) {
          month = "0" + month;
        }
        const item = {
          value: "" + dateStart.getFullYear() + month,
          name: dateStart.toLocaleDateString("en-US", { month: "long" })
        };
        months.push(item);
        dateStart.setMonth(dateStart.getMonth() + 1);
      }
      this.prevMonths = months.reverse();
    },
    resetSelectedClipCategory() {
      this.$store.commit("explore/resetClipCategories");
      this.selectedClipCategory = {};
    }
  },
  watch: {
    page() {
      this.resetSelectedClipCategory();
      this.postsStatFinishViewAction();
      this.getPageData();
    },
    category() {
      this.getPageData();
    },
    ["$route.params.tag"]() {
      this.init();
    },
    ["$route.params.category"](newValue, oldValue) {
      if (newValue !== undefined && oldValue !== undefined) {
        this.resetSelectedClipCategory();
        this.init();
      }
    },
    selectedMonth(value) {
      if (this.page === "topmodels") {
        this.$store.commit("topModels/reset");
        this.$store.dispatch("topModels/getPosts", { month: value });
      }
    },
    selectedClipCategory(newValue) {
      if (!newValue.id) {
        this.selectedClipCategory = defaultSelectedClipCategory;
        return;
      }
      this.getPageData();
    }
  },
  mounted() {
    this.useRouteRedirect(
      "magazineRedirect",
      "/settings/magazine",
      !!this.user
    );
    this.useRouteRedirect(
      "magazineModalRedirect",
      "/settings/magazine/one-click",
      !!this.user
    );
    this.initPrevMonths();
  }
};
</script>

<style lang="scss" scoped>
.videoCategories,
.clipCategories {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-evenly;
  padding: 20px 10px;
  &_item {
    cursor: pointer;
    color: #2196f3;
    border-bottom: 2px solid transparent;
    &:hover {
      color: #222b32;
    }
    &.selected {
      font-weight: 500;
      color: #222b32;
    }
    a {
      color: inherit;
      &.router-link-exact-active {
        font-weight: 500;
        color: #222b32;
      }
    }
  }
  &_selector {
    margin-bottom: 10px;
    .label {
      flex: 0 0 0;
    }
  }
}
.month-options {
  margin-left: -20px;
  /* padding: 10px 20px; */
  @media (max-width: 991px) {
    margin-left: 0px;
    padding: 10px 20px;
  }
  select {
    margin-left: 13px;
  }
}
</style>
