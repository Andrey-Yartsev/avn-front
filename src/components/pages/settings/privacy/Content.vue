<template>
  <div class="SettingsPrivacyView">
    <form id="SettingsPrivacyView" v-on:submit.stop.prevent="save">
      <h1 class="form-title">Privacy Settings</h1>
      <div class="form-title border-top">
        <div class="inner">
            <span class="semi-transparent">
              Private Profile
              <p class="subtext">Only subscribers will see your posts</p>
            </span>
          <label class="toggle-element">
            <input type="checkbox" name="isPrivate" value="true" v-model="localUser.isPrivate">
            <span></span>
          </label>
        </div>
      </div>
      <div class="add-options-blur shadow-block isPrivateHidePosts" v-if="localUser.isPrivate">
        <div class="container">
          <div class="form-group form-group-checkbox">
            <label class="form-group-inner">
              <span class="label">Blur posts content</span>
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
      <div class="form-title border-top disabled border-top-mobile">
        <div class="inner">
          <span class="semi-transparent">
            Tweet my posts
            <p class="subtext">This can be changed for each individual post later</p>
          </span>
          <label class="toggle-element">
            <input type="checkbox" name="isPostsTweets" value="true" v-model="localUser.isPostsTweets">
            <span></span>
          </label>
        </div>
      </div>
      <div class="shadow-block no-padding hidden-desktop">
        <div class="settings-nav">
          <a href="/settings/privacy/twitter" class="settings-nav__item"><span>Twitter</span><span class="value">Connect</span></a>
        </div>
      </div>

      <div class="twitter-block hidden-mobile">
        <ConnectTwitter @connected="twitterConnected"/>
      </div>

      <div class="container hidden-mobile">
        <div class="form-group">
          <div class="form-group-inner">
            <span class="label"></span>
            <button type="submit" class="btn lg saveChanges" :disabled="!changed">Save changes</button>
          </div>
        </div>
      </div>
    </form>
    <BlockedUsers />
  </div>
</template>

<script>
import Common from "../common";
import BlockedUsers from "../BlockedUsers";
import ConnectTwitter from "../ConnectTwitter";

export default {
  name: "PrivacySettingsContent",

  mixins: [Common],

  components: {
    BlockedUsers,
    ConnectTwitter
  },

  methods: {
    twitterConnected() {
      this.$router.push("/settings/privacy");
    }
  }
};
</script>
