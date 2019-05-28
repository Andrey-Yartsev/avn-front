<template>
  <div class="loader-container" v-if="!profile">
    <Loader :fullscreen="false" text="" class="transparent small" />
  </div>
  <div class="special-container" v-else>
    <router-link class="addPost-btn-float" to="/addPost" v-if="isAuth()" />
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
            <div class="content-col">
              <div
                class="sticky-header-controls header-mobile"
                v-if="$mq === 'mobile'"
              >
                <router-link
                  class="header-return-btn go-back go-back_arrow header-return-btn_icn-abs"
                  :to="`/${profile.username}`"
                />
                <h1 class="page-title">Likes</h1>
              </div>
              <div class="explore">
                <div class="feed-wrapper">
                  <div class="postCollectionView">
                    <div class="posts">
                      <div class="post">
                        <div class="post-wrapper">
                          <div class="post-details">
                            <div class="post-header">
                              <a
                                href="#"
                                class="avatar avatar_gap-r-sm avatar_sm"
                              >
                                <span class="avatar__img">
                                  <img
                                    src="https://avnsocial-dev.s3.amazonaws.com/files/9/9j/9jn/9jnvsevyf8kjz5frufzmqkbutnyczkid1558107368/avatar.jpg"
                                  />
                                </span>
                              </a>
                              <a href="#" class="name">user1</a>
                              <span class="user-login">
                                <a href="#">id468343</a>
                              </span>
                              <span class="follow-link hidden">Follow</span>
                              <div class="more-functions">
                                <div class="more-functions__overlay"></div>
                                <div class="more-functions__btn">
                                  <div class="more-functions__btn-text"></div>
                                </div>
                                <div class="more-functions__dropdown">
                                  <div class="more-functions__dropdown-inside">
                                    <ul class="more-functions__list">
                                      <li class="more-functions__item">
                                        <button
                                          type="button"
                                          class="report more-functions__link"
                                        >
                                          <span class="more-functions__option"
                                            >Report post</span
                                          >
                                        </button>
                                      </li>
                                      <li class="more-functions__item">
                                        <button
                                          type="button"
                                          class="btn-copy-link more-functions__link"
                                        >
                                          <span class="more-functions__option"
                                            >Copy link to post</span
                                          >
                                        </button>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <p class="text"></p>
                            <div
                              class="media"
                              style='background-image: url("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAUEBAUEAwUFBAUGBgUGCA4JCAcHCBEMDQoOFBEVFBMRExMWGB8bFhceFxMTGyUcHiAhIyMjFRomKSYiKR8iIyL/2wBDAQYGBggHCBAJCRAiFhMWIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiL/wAARCAAdADIDASIAAhEBAxEB/8QAGgAAAgMBAQAAAAAAAAAAAAAABAUAAgMGB//EAB0QAAICAwEBAQAAAAAAAAAAAAABAwQCESExElH/xAAXAQEBAQEAAAAAAAAAAAAAAAACAQMA/8QAGBEBAQEBAQAAAAAAAAAAAAAAAAECERL/2gAMAwEAAhEDEQA/APSLNvSfRFbu+9MrVzj6IrVptvobsplvYvdfQJ2236L5Zm2UjybYenw4ileTGEO3oV1sW2h7Vh3oNdFvh/hBgq/PCBVy88+99Fk2TyN822YNbZn6aTIb4bYTBD0vHgmw+CNbQs1LBFSDqOhpw+cFtXBcH9PFcGAlQcXCBqxWkQiv/9k=");'
                            >
                              <div
                                class="lds-dual-ring transparent small with-text not-fullscreen"
                              >
                                <div class="loader-text">
                                  Media is currently processing
                                </div>
                              </div>
                              <figure class="media-item active">
                                <a href="#" class="postLink">
                                  <span class="video-placeholder">
                                    <img
                                      src="https://avnsocial-dev.s3.amazonaws.com/files/0/0c/0ce2284415b992cc70d5cdf6d5c7b5b9/718x404_d088f9bd2fc71b32c1b872a70b2850556207920_preview.jpg"
                                    />
                                  </span>
                                </a>
                              </figure>
                            </div>
                            <div class="actions">
                              <span class="active actions__btn">
                                <span class="btn-icon likes"></span>
                              </span>
                              <span class="actions__btn comments-btn">
                                <span class="btn-icon comments"></span>
                                2
                              </span>
                              <span class="actions__btn">
                                <span class="btn-icon tips"></span>
                              </span>
                              <time class="timestamp">
                                <a href="#" class="postLink">
                                  May 24
                                </a>
                              </time>
                            </div>
                          </div>
                          <div class="postComments">
                            <div class="comments-list comments-list_main">
                              <div class="comment">
                                <a
                                  href="#"
                                  class="avatar avatar_gap-r-sm avatar_sm"
                                >
                                  <span class="avatar__img">
                                    <img
                                      src="https://avnsocial-dev.s3.amazonaws.com/files/t/tl/tl4/tl4zhrssmfqykrexcm9ojmyo4rbpbme31558945116/avatar.jpg"
                                    />
                                  </span>
                                </a>
                                <div class="comment-content">
                                  <div class="comment-body">
                                    <a href="#" class="comment-author-name name"
                                      >Павел</a
                                    >
                                    <div class="comment-text">yo</div>
                                  </div>
                                  <div class="comment-footer">
                                    <time class="timestamp">May 27</time>
                                    <button
                                      type="button"
                                      class="post-option btn-reply"
                                    >
                                      Reply
                                    </button>
                                  </div>
                                  <button class="btn-like">
                                    <span
                                      class="likes likes_size-sm likes_reset-gap-r"
                                    ></span>
                                  </button>
                                </div>
                              </div>
                              <div class="comment">
                                <a
                                  href="#"
                                  class="avatar avatar_gap-r-sm avatar_sm"
                                >
                                  <span class="avatar__img">
                                    <img
                                      src="https://avnsocial-dev.s3.amazonaws.com/files/t/tl/tl4/tl4zhrssmfqykrexcm9ojmyo4rbpbme31558945116/avatar.jpg"
                                    />
                                  </span>
                                </a>
                                <div class="comment-content">
                                  <div class="comment-body">
                                    <a href="#" class="comment-author-name name"
                                      >Павел</a
                                    >
                                    <div class="comment-text">че каво</div>
                                  </div>
                                  <div class="comment-footer">
                                    <time class="timestamp">May 27</time>
                                    <button
                                      type="button"
                                      class="post-option btn-reply"
                                    >
                                      Reply
                                    </button>
                                  </div>
                                  <button class="btn-like">
                                    <span
                                      class="likes likes_size-sm likes_reset-gap-r"
                                    ></span>
                                  </button>
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
          </div>
        </div>
      </div>
    </div>
    <Footer class="site-footer_main" />
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";
// import InfinityScrollMixin from "@/mixins/infinityScroll";
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
  mixins: [/* InfinityScrollMixin, */ UserMixin],
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
    // users() {
    //   // return this.$store.state.followers.posts;
    // },
    store() {
      return this.$store.state.likes;
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
    // init() {
    //   this.$store.commit("followers/reset");
    //   this.getPosts();
    // },
    // follow() {
    //   if (this.user) {
    //     this.$store.dispatch("profile/home/follow", this.profile.id);
    //   } else {
    //     this.$router.push("/login");
    //   }
    // },
    // unfollow() {
    //   this.$store.dispatch("profile/home/unfollow", this.profile.id);
    // },
    // sendMessage() {
    //   this.$router.push("/chat/" + this.profile.id);
    // },
    // infinityScrollGetDataMethod() {
    //   if (this.profile) {
    //     this.getPosts();
    //   }
    // },
    // subsRequested(data) {
    //   if (data.action === "unsubscribe") {
    //     this.unsubscribed(data.result);
    //   } else if (data.action === "resubscribe") {
    //     this.resubscribed(data.result);
    //   } else {
    //     throw new Error("Wrong action");
    //   }
    // },
    // unsubscribed(result) {
    //   if (!result.success) {
    //     return;
    //   }
    //   this.$store.dispatch("profile/home/extend", {
    //     subscribedByProgress: true
    //   });
    //   this.$store.dispatch("global/flashToast", {
    //     text: "You have unsubscribed successfully"
    //   });
    // },
    // resubscribed(result) {
    //   if (!result.success) {
    //     return;
    //   }
    //   this.$store.dispatch("profile/home/extend", {
    //     subscribedByProgress: false
    //   });
    //   this.$store.dispatch("global/flashToast", {
    //     text: "You have resubscribed successfully"
    //   });
    // },
    // getPosts() {
    //   this.$store.dispatch("followers/getPosts", { type: this.page });
    // },
    // openAddPostModal() {
    //   this.$store.dispatch("modal/show", {
    //     name: "addPost"
    //   });
    // }
  },
  watch: {
    page() {
      // this.init();
    }
  },
  created() {
    // this.init();
  }
};
</script>
