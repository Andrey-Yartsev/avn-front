<template>
  <div class="loader-container" v-if="loading">
    <Loader :fullscreen="false" text="" class="transparent small" />
  </div>
  <div class="profile" v-else>
    <router-link class="addPost-btn-float" to="/addPost"/>
    <HeaderControl :profile="profile" />
    <div class="white-bg-block">
      <div class="bg">
        <div class="bg-wrap">
          <img v-if="bgPreview" :src="bgPreview" />
          <img v-else-if="profile.header" :src="profile.header" />
        </div>
        <div class="container">
          <div class="controls-select-picture" v-if="isOwner(profile.id)">
            <label
              for="bg" class="select-user-image"
              :class="{hide: !showBgAdd}"
            >Add background picture</label>
            <input
              type="file"
              id="bg"
              ref="bg"
              accept=".jpg,.jpeg,.gif,.png"
              @change="setBgPreview"
            >
            <div class="profile-picture-btns" :class="{show: showBgSave}">
              <button
                class="btn-cancel-changes cancel-changes"
                @click="resetBgPreview"
              ></button>
              <button
                class="btn save-changes"
                @click="saveBg"
              >Save changes</button>
            </div>
          </div>
        </div>
      </div>
      <div class="profile-images">
        <div class="container">
          <ProfileAvatar :profile="profile" />
        </div>
      </div>
      <div class="profile-header hidden-desktop">
        <div class="profile-name">
          <div class="profile-name__main">
            <span class="name">{{ profile.name }}</span>
            <span class="verified-user" v-if="profile.isVerified"></span>
          </div>
          <span class="user-login"><a>{{ profile.username }}</a></span>
        </div>
        <div class="profile-desc hidden-desktop">
          <p class="profile-text" v-if="profile.about">{{ profile.about }}</p>
          <a
            v-if="profile.twitterUsername"
            :href="'https://twitter.com/' + profile.twitterUsername"
            class="profile-twitter-link" target="_blank"
            rel="nofollow"
          >twitter.com/{{ profile.twitterUsername }}</a>
          <FollowersCounter :profile="profile" />
        </div>
      </div>
      <div class="post-types-tabs">
        <div class="container">
          <div class="profile-name">
            <span class="name">
              {{ profile.name }}
              <span class="verified-user" v-if="profile.isVerified"></span>
            </span>
            <span class="user-login"><a>{{ profile.username }}</a></span>
          </div>
          <div class="row">
            <div class="content-col">
              <div class="profile-btns-group">
                <div class="btns-user-activity">
                  <router-link :class="!pageName ? 'active' : ''" :to="`/${profile.username}/posts`">
                    <span class="value">{{ profile.postsCount }}</span>
                    <span class="label">Posts</span>
                  </router-link>
                  <router-link :to="`/${profile.username}/photos`">
                    <span class="value">{{ profile.photosCount }}</span>
                    <span class="label">Photos</span>
                  </router-link>
                  <router-link :to="`/${profile.username}/videos`">
                    <span class="value">{{ profile.videosCount }}</span>
                    <span class="label">Videos</span>
                  </router-link>
                </div>
                <div class="profile-actions" v-if="isOwner(this.profile.id)">
                  <router-link to="/settings/profile" class="btn-edit-profile">Edit profile</router-link>
                  <button class="btn-make-post make-post-btn" @click="openAddPostModal">New post</button>
                </div>
                <div class="profile-actions" v-else>

                  <div class="profile-actions-tip-form" :class="{show: showTip}">
                    <Tip
                      :user="profile"
                      ref="tip"
                      @cancel="closeTip"
                    />
                  </div>

                  <button
                    v-if="profile.canEarn"
                    type="button" class="profile-actions__btn profile-tip-btn selected"
                    @click="showTip = true"
                  >Fund</button>

                  <SubscribeButton :profile="profile" @requested="subsRequested"/>
                  <div class="subscribeView">
                    <div
                      v-if="profile.followedBy"
                      @click="unfollow"
                      class="profile-actions__btn btn-subscribe disable-state">
                      <div class="btn-subscribe__label">
                        Unfollow
                      </div>
                    </div>
                    <div
                      v-else
                      @click="follow"
                      class="profile-actions__btn btn-subscribe">
                      <div class="btn-subscribe__label">
                        Follow
                      </div>
                    </div>
                  </div>
                  <button
                    v-if="profile.followedBy"
                    @click="sendMessage"
                    type="button" class="profile-actions__btn profile-message-btn"
                  >Message</button>
                  <UserDropdown
                    class="profile-actions__btn profile-more-functions more-functions_with-text hidden-mobile"
                    :profile="profile"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="container">
        <div class="row">
          <div class="aside-col hidden-mobile">
            <div class="profile-name">
              <div class="profile-name__main">
                <span class="name">
                  {{ profile.name }}
                </span>
                <span class="verified-user" v-if="profile.isVerified"></span>
              </div>
              <span class="user-login"><a>{{ profile.username }}</a></span>
            </div>
            <div class="profile-desc">
              <p class="profile-text"></p>
              <a
                v-if="profile.twitterUsername"
                :href="'https://twitter.com/' + profile.twitterUsername"
                class="profile-twitter-link" target="_blank"
                rel="nofollow"
              >twitter.com/{{ profile.twitterUsername }}</a>
              <FollowersCounter :profile="profile" />
            </div>
          </div>
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
import ProfileAvatar from "@/components/common/profileAvatar/Index";
import InfinityScrollMixin from "@/mixins/infinityScroll";
import UserMixin from "@/mixins/user";
import SubscribeButton from "@/components/subscription/Button";
import Tip from "@/components/common/tip/User";
import FileUpload from "@/mixins/fileUpload";
import ProfileBg from "@/mixins/profileBg";
import UserDropdown from "@/components/common/userDropdawn/Index";
import HeaderControl from "@/components/common/profile/headerControl/Index";
import FollowersCounter from "@/components/common/profile/followersCounter/Index";

export default {
  name: "ProfileHome",

  mixins: [InfinityScrollMixin, UserMixin, FileUpload, ProfileBg],

  components: {
    Loader,
    PostCollection,
    SubscribeButton,
    Tip,
    ProfileAvatar,
    UserDropdown,
    FollowersCounter,
    HeaderControl
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
    funded() {
      return this.$store.state.tip.funded;
    },
    allMediaTypes() {
      return [...this.inputAcceptTypes.photo];
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
    funded() {
      this.closeTip();
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
        subscribedByExpire: true
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
        subscribedByExpire: false
      });
      this.$store.dispatch(
        "global/flashToast",
        "You have resubscribed successfully"
      );
    },
    getPosts() {
      this.$store.dispatch("profile/home/getPosts", this.profile.id);
    },
    openAddPostModal() {
      this.$store.dispatch("modal/show", {
        name: "addPost"
      });
    },
    closeTip() {
      this.showTip = false;
      this.$refs.tip.reset();
    }
  },

  created() {
    this.init();
  }
};
</script>

<style scoped>
.loader-container {
  position: relative;
  height: 300px;
}
</style>
