<template>
  <div v-if="!profile">Loading</div>
  <div v-else class="myProfile">
    <router-link class="addPost-btn-float" to="/addPost"/>
    <div class="sticky-header-controls">
      <a class="header-return-btn"></a>
      <div class="profile-name__header">
        <span class="name">
          {{ profile.name }}
        </span>
        <span class="verified-user"></span>
        <span class="user-login">
          <router-link :to="'/' + profile.name">{{ profile.username }}</router-link>
        </span>
      </div>
    </div>
    <div class="white-bg-block">
      <div class="bg">
        <div class="bg-wrap"></div>
        <div class="container">
          <div class="controls-select-picture" v-if="isOwner(this.profile.id)">
            <label for="bg" class="select-user-image">Add Background Picture</label>
            <input type="file" id="bg" accept=".jpg,.jpeg,.gif,.png">
            <div class="profile-picture-btns">
              <button class="btn-cancel-changes cancel-changes"></button>
              <button class="btn save-changes">Save changes</button>
            </div>
          </div>
        </div>
      </div>
      <div class="profile-images">
        <div class="container">
          <div class="profile-images__inner">
            <span class="avatar" :class="{'with-story': profile.hasNotViewedStory}">
              <img :src="profile.avatar" v-if="profile.avatar">
            </span>
          </div>
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
            rel="nofollow">twitter.com/{{ profile.twitterUsername }}</a>

          <div class="profile-data">
            <div class="item">
              <router-link to="/following">
                <span class="value">{{ profile.followingCount }}</span><span class="label">Following</span>
              </router-link>
            </div>
            <div class="item">
              <router-link to="/followers">
                <span class="value">{{ profile.followersCount }}</span><span class="label">Followers</span>
              </router-link>
            </div>
            <div class="item">
              <a><span class="value">{{ profile.favoritesCount }}</span><span class="label">Likes</span></a>
            </div>
          </div>
        </div>
      </div>
      <div class="post-types-tabs">
        <div class="container">
          <div class="profile-name">
            <span class="name">
              {{ profile.name }}
              <span class="verified-user" v-if="profile.isVerified"></span>
            </span>
            <span class="user-login">
              <router-link :to="'/' + profile.username">{{ profile.username }}</router-link>
            </span>
          </div>
          <div class="row">
            <div class="content-col">
              <div class="profile-btns-group">
                <div class="btns-user-activity">
                  <router-link class="active" :to="'/' + profile.username + '/posts'">
                    <span class="value">{{ profile.postsCount }}</span>
                    <span class="label">Posts</span>
                  </router-link>
                  <router-link :to="'/' + profile.username + '/posts'">
                    <span class="value">{{ profile.photosCount }}</span>
                    <span class="label">Photos</span>
                  </router-link>
                  <router-link :to="'/' + profile.username + '/videos'">
                    <span class="value">{{ profile.videosCount }}</span>
                    <span class="label">Videos</span>
                  </router-link>
                </div>

                <div class="profile-actions" v-if="isOwner(this.profile.id)">
                  <router-link to="/settings/profile" class="btn-edit-profile">Edit profile</router-link>
                  <button class="btn-make-post make-post-btn">New post</button>
                </div>

                <div class="profile-actions" v-else>

                  <button
                    v-if="profile.canEarn"
                    type="button" class="profile-actions__btn profile-tip-btn selected">Fund</button>

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
                    type="button" class="profile-actions__btn profile-message-btn">Message</button>

                  <div class="profile-actions__btn more-functions profile-more-functions more-functions_with-text hidden-mobile">
                    <div class="more-functions__overlay"></div>
                    <div class="more-functions__btn">
                      <div class="more-functions__btn-text">
                        More
                      </div>
                    </div>
                    <div class="more-functions__dropdown">
                      <div class="more-functions__dropdown-inside">
                        <ul>
                          <li><a class="menu-report" href="#">Report</a></li>
                          <li><a class="menu-block" href="#">Block</a></li>
                        </ul>
                      </div>
                    </div>
                  </div>

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
                rel="nofollow">twitter.com/{{ profile.twitterUsername }}</a>

              <div class="profile-data">
                <div class="item">
                  <router-link to="/following">
                    <span class="value">{{ profile.followingCount }}</span><span class="label">Following</span>
                  </router-link>
                </div>
                <div class="item">
                  <router-link class="" to="/followers">
                    <span class="value">{{ profile.followersCount }}</span><span class="label">Followers</span></router-link>
                </div>
                <div class="item">
                  <span class="value">{{ profile.favoritesCount }}</span><span class="label">Likes</span>
                </div>
              </div>
            </div>
          </div>
          <div class="content-col">
            <p class="empty-feed hidden">
              <span>Nothing here yet</span>
              <button type="button" class="make-post-btn feed">Create new post</button>
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
import PostCollection from "@/components/common/postCollection/Index";
import InfinityScrollMixin from "@/mixins/infinityScroll";
import UserMixin from "@/mixins/user";
import SubscribeButton from "@/components/subscription/Button";

export default {
  name: "ProfileHome",

  mixins: [InfinityScrollMixin, UserMixin],

  components: {
    PostCollection,
    SubscribeButton
  },

  computed: {
    username() {
      return this.$route.params[0].replace(/\/(.*)/, "$1");
    },
    profile() {
      return this.$store.state.profile.home.profile;
    },
    posts() {
      return this.$store.state.profile.home.posts;
    },
    store() {
      return this.$store.state.profile.home;
    }
  },

  watch: {
    username() {
      this.init();
    }
  },

  methods: {
    init() {
      this.$store.commit("profile/home/resetPageState");
      this.$store
        .dispatch("profile/home/fetchProfile", this.username)
        .then(() => {
          this.$store.dispatch("profile/home/getPosts", this.profile.id);
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
        this.$store.dispatch("profile/home/getPosts", this.profile.id);
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
    }
  },

  created() {
    this.init();
  }
};
</script>
