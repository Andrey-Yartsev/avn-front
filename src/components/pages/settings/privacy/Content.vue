<template>
  <div :class="viewClass">
    <div class="hidden-desktop" v-if="view === 'twitter'">
      <div class="form-title">
        <div class="inner">
          <span class="semi-transparent">{{ user.name }}</span>
        </div>
      </div>
    </div>

    <form v-on:submit.stop.prevent="save">
      <h1 class="form-title" v-if="$mq === 'desktop'">Privacy Settings</h1>
      <div class="form-title private-profile-block border-top">
        <div class="inner">
          <span class="semi-transparent">
            Private Profile
            <p class="subtext">Only subscribers will see your posts</p>
          </span>
          <label class="toggle-element">
            <input
              type="checkbox"
              name="isPrivate"
              value="true"
              v-model="localUser.isPrivate"
            />
            <span></span>
          </label>
        </div>
      </div>
      <!--
      <div class="add-options-blur shadow-block isPrivateHidePosts" v-if="localUser.isPrivate">
        <div class="container">
          <div class="form-group form-group_with-label form-group-checkbox">
            <label class="form-group-inner">
              <span class="label label_align-start">Blur posts content</span>
              <div class="checkbox-wrapper">
                <label class="checkbox-label">
                  <input type="checkbox" name="isPrivateHidePosts" value="true" v-model="localUser.isPrivateHidePosts">
                  <span></span>
                </label>
                <div class="input-desc">
                  Users who has not subscribed to your profile would see blurred post's content until they subscribe
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>
      -->
      <div
        class="form-title tweet-posts-block border-top disabled border-top-mobile"
      >
        <div class="inner">
          <span class="semi-transparent">
            Tweet my posts
            <p class="subtext">
              This can be changed for each individual post later
            </p>
          </span>
          <label class="toggle-element">
            <input
              type="checkbox"
              name="isPostsTweets"
              value="true"
              v-model="localUser.isPostsTweets"
            />
            <span></span>
          </label>
        </div>
      </div>
      <div class="go-twitter-block shadow-block no-padding hidden-desktop">
        <div class="settings-nav">
          <router-link to="/settings/privacy/twitter" class="settings-nav__item"
            ><span>Twitter</span><span class="value">Connect</span></router-link
          >
        </div>
      </div>

      <ConnectTwitter v-if="$root.isTeamApp" @connected="twitterConnected" />

      <div class="container hidden-mobile">
        <div class="form-group form-group_with-label">
          <div class="form-group-inner">
            <span class="label"></span>
            <button
              type="submit"
              class="btn lg saveChanges"
              :disabled="!changed"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </form>
    <BlockedUsers mobileBlockedRoute="/settings/privacy/blocked" />
  </div>
</template>

<script>
import Common from "../common";
import BlockedUsers from "../BlockedUsers";
import ConnectTwitter from "../ConnectTwitter";
import User from "@/mixins/user";
import ucFirst from "@/helpers/ucFirst";

export default {
  name: "PrivacySettingsContent",

  mixins: [Common, User],

  components: {
    BlockedUsers,
    ConnectTwitter
  },

  computed: {
    view() {
      return this.$route.params.view || "settingsPrivacy";
    },
    viewClass() {
      return ucFirst(this.view) + "View";
    }
  },

  methods: {
    twitterConnected() {
      this.$router.push("/settings/privacy");
    }
  }
};
</script>
