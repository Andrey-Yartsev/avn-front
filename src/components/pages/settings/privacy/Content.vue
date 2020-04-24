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
      <h1 class="form-title settings-title" v-if="$mq === 'desktop'">
        Privacy Settings
      </h1>
      <div
        class="form-title private-switcher-block private-profile-block border-top"
      >
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
            <span class="toggle-element_switcher"></span>
          </label>
        </div>
      </div>

      <div class="watermarks-settings">
        <div class="form-title border-top border-top-mobile">
          <div class="inner">
            <span class="semi-transparent">
              Watermarks media
            </span>
          </div>
        </div>
        <div class="shadow-block">
          <div class="container">
            <div class="form-group form-group_with-label checkbox-group">
              <label class="form-group-inner">
                <div class="checkbox-wrapper">
                  <input
                    type="checkbox"
                    name="hasWatermarkPhoto"
                    value="true"
                    v-model="localUser.hasWatermarkPhoto"
                  />
                  <span class="label icn-item"
                    >Enable watermarks for photo</span
                  >
                </div>
              </label>
              <label class="form-group-inner">
                <div class="checkbox-wrapper">
                  <input
                    type="checkbox"
                    name="hasWatermarkVideo"
                    value="true"
                    v-model="localUser.hasWatermarkVideo"
                  />
                  <span class="label icn-item"
                    >Enable watermarks for video</span
                  >
                </div>
              </label>

              <div
                class="form-group form-group_with-label pb-reset"
                v-if="
                  localUser.hasWatermarkPhoto || localUser.hasWatermarkVideo
                "
              >
                <label class="form-group-inner">
                  <span class="label">Watermark text</span>
                  <span class="form-group form-group_clear-gaps">
                    <span class="form-field">
                      <input
                        type="text"
                        name="watermarkText"
                        v-model="localUser.watermarkText"
                    /></span>
                  </span>
                </label>
              </div>
              <WatermarkImageUploader
                v-if="
                  localUser.hasWatermarkPhoto || localUser.hasWatermarkVideo
                "
                @change="watermarkImageChange"
                @remove="watermarkImageRemove"
                :localUser="localUser"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="watermarks-settings">
        <div class="form-title border-top border-top-mobile">
          <div class="inner">
            <span class="semi-transparent">
              Post likes details
              <p class="subtext">
                Allow the following users to see who has liked your posts
              </p>
            </span>
          </div>
        </div>
        <div class="shadow-block">
          <div class="container">
            <div class="form-group form-group_with-label radio-group">
              <div class="form-group-inner">
                <label class="radio-wrapper icn-item m-inline">
                  <input
                    type="radio"
                    name="viewFavoriteAccess"
                    value="all"
                    v-model="localUser.viewFavoriteAccess"
                    v-validate="'required'"
                  />
                  <span class="label">
                    All
                  </span>
                </label>
                <label class="radio-wrapper icn-item m-inline">
                  <input
                    type="radio"
                    name="viewFavoriteAccess"
                    value="subscribers"
                    v-model="localUser.viewFavoriteAccess"
                    v-validate="'required'"
                  />
                  <span class="label">
                    Subscribers
                  </span>
                </label>
                <label class="radio-wrapper icn-item m-inline">
                  <input
                    type="radio"
                    name="viewFavoriteAccess"
                    value="non-subscribers"
                    v-model="localUser.viewFavoriteAccess"
                    v-validate="'required'"
                  />
                  <span class="label">
                    Non-Subscribers
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="user.canEarn"
        class="form-title tweet-posts-block border-top"
        :class="{ disabled: !user.isWantEarn || price() <= 0 }"
      >
        <div class="inner">
          <span class="semi-transparent">
            Messaging
            <p class="subtext">
              Allow chats from subscribers only
            </p>
          </span>
          <label class="toggle-element">
            <input
              type="checkbox"
              name="isStreamsTweet"
              value="false"
              v-model="localUser.isMsgFromSubscribersOnly"
            />
            <span class="toggle-element_switcher"></span>
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
        class="form-title tweet-posts-block border-top"
        :class="{ disabled: !localUser.isTwitterConnected }"
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
              :disabled="!localUser.isTwitterConnected"
            />
            <span class="toggle-element_switcher"></span>
          </label>
        </div>
        <div class="inner">
          <span class="semi-transparent">
            Tweet my live streams
          </span>
          <label class="toggle-element">
            <input
              type="checkbox"
              name="isStreamsTweet"
              value="false"
              v-model="localUser.isPostsTweetsOnGoLive"
              :disabled="!localUser.isTwitterConnected"
            />
            <span class="toggle-element_switcher"></span>
          </label>
        </div>
      </div>
      <div
        class="go-twitter-block shadow-block no-padding hidden-desktop"
        v-if="$mq === 'mobile'"
      >
        <div class="settings-nav">
          <router-link
            to="/settings/privacy/twitter"
            class="settings-nav__item settings-nav__item_arr"
            ><span>Twitter</span><span class="value">Connect</span></router-link
          >
        </div>
      </div>

      <ConnectTwitter @connected="twitterConnected" />

      <div
        class="form-title private-switcher-block private-profile-block border-top"
        v-if="localUser.isTwitterConnected"
      >
        <div class="inner">
          <span class="semi-transparent">
            Private Twitter
            <p class="subtext">Users will not be able to see your twitter</p>
          </span>
          <label class="toggle-element">
            <input
              type="checkbox"
              name="isPrivateTwitter"
              value="true"
              v-model="localUser.isPrivateTwitter"
            />
            <span class="toggle-element_switcher"></span>
          </label>
        </div>
      </div>

      <Blocking
        ref="blocking"
        @change="blockingChange"
        :localUser="localUser"
      />

      <div class="container hidden-mobile" v-if="$mq === 'desktop'">
        <div class="form-group-btn">
          <button
            type="submit"
            class="btn lg btn_fix-width"
            :disabled="!changed || loading"
          >
            Save changes
          </button>
        </div>
      </div>
    </form>
    <BlockedUsers
      v-if="!this.$route.params.view || this.$route.params.view === 'blocked'"
      title="Blocked users"
      mobileBlockedRoute="/settings/privacy/blocked"
      subtext="These people can't see your posts, stories and live streams"
    />
    <BlockedUsers
      v-if="
        !this.$route.params.view || this.$route.params.view === 'blockedPosts'
      "
      title="Blocked posts"
      mobileBlockedRoute="/settings/privacy/blockedPosts"
      source="blockedPosts"
      subtext="There are people, whose posts you don't want to see"
    />
  </div>
</template>

<script>
import Common from "../common";
import BlockedUsers from "../BlockedUsers";
import ConnectTwitter from "../ConnectTwitter";
import User from "@/mixins/user";
import ucFirst from "@/helpers/ucFirst";
import WatermarkImageUploader from "./WatermarkImageUploader";
import Blocking from "./Blocking";

export default {
  name: "PrivacySettingsContent",

  mixins: [Common, User],

  components: {
    BlockedUsers,
    ConnectTwitter,
    WatermarkImageUploader,
    Blocking
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
    },
    watermarkImageChange(file) {
      this.localUser.watermarkFile = file;
    },
    watermarkImageRemove() {
      this.localUser.watermarkFile = "";
    },
    blockingChange(data) {
      this.localUser = { ...this.localUser, ...data };
    },
    save() {
      if (!this.$refs.blocking.isFormValid) {
        this.$store.dispatch("global/flashToast", {
          text: "Please, fix IP & Geo Blocking validation",
          type: "error"
        });
        return;
      }
      this.$store.dispatch("profile/update", this.localUser);
    },
    price() {
      return parseFloat(this.user.subscribePrice, 10);
    }
  }
};
</script>
