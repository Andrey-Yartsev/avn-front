<template>
    <div class="loader-container" v-if="loading">
        <Loader :fullscreen="false" text="" class="transparent small" />
    </div>
    <div class="profile" v-else>
        <router-link class="addPost-btn-float" to="/addPost"/>
        <HeaderControl :profile="profile" />
        <div class="white-bg-block">
            <ProfileBackground  :profile="profile" />
            <div class="profile-images">
                <ProfileAvatar :profile="profile" />
            </div>
            <div class="profile-header-container" v-bind:style="{ 'left': -scrollBarWidth + 'px' }">
                <div class="profile-header">
                    <div class="profile-name">
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
                        <FollowersCounter :profile="profile" />
                    </div>
                </div>
            </div>
            <div class="post-types-tabs" v-bind:style="{ 'margin-right': -scrollBarWidth + 'px', 'padding-right': scrollBarWidth + 'px' }">
                <div class="container">
                    <div class="profile-name">
            <span class="name">
              {{ profile.name }}
            <span class="verified-user" v-if="profile.isVerified"></span>
            </span>
                        <span class="user-login"><a>{{ profile.username }}</a></span>
                    </div>
                    <ProfileActions
                            :profile="profile"
                            :page="pageName"
                    />
                </div>
            </div>
            <div class="container">
                <div class="row">
                    <div class="content-col">
                        <p :class="['empty-feed', { hidden: postLoading || posts.length }]">
                            <span>Nothing here yet</span>
                            <button
                                    v-if="isOwner(this.profile.id)"
                                    @click="openAddPostModal"
                                    type="button"
                                    class="make-post-btn feed"
                            >Create new post</button>
                        </p>
                        <div class="posts-container">
                            <PostCollection
                                    :class="'rounded-container'"
                                    :posts="posts"
                                    from="profile/home"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Loader from "@/components/common/Loader";
import PostCollection from "@/components/common/postCollection/Index";
import ProfileAvatar from "@/components/common/profile/avatar/Index";
import InfinityScrollMixin from "@/mixins/infinityScroll";
import UserMixin from "@/mixins/user";
import FileUpload from "@/mixins/fileUpload";
import HeaderControl from "@/components/common/profile/headerControl/Index";
import FollowersCounter from "@/components/common/profile/followersCounter/Index";
import ProfileBackground from "@/components/common/profile/background/Index";
import ProfileActions from "@/components/common/profile/actions/Index";
import Wsp from "@/mixins/wsp";

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
    ProfileActions
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
    }
  },
  watch: {
    username() {
      this.init();
    },
    pageName() {
      this.init();
    },
    deletedPost() {
      this.$store.dispatch("profile/home/fetchProfile", this.username);
    },
    updatedPost() {
      this.$store.dispatch("profile/home/updatePost", this.updatedPost);
    }
  },
  methods: {
    init() {
      this.$store.commit("profile/home/resetPageState");
      this.$store
        .dispatch("profile/home/fetchProfile", this.username)
        .then(() => {
          this.$store.dispatch("profile/home/setSource", this.source);
          this.getPosts();
        });
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
      this.$store.dispatch("profile/home/getPosts", this.profile.id);
    }
  },
  created() {
    this.init();
  }
};
</script>

<style scoped>
.loader-container {
  height: 300px;
}
</style>
