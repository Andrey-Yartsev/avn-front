<template>
  <div :class="viewClass">
    <form class="story-form" v-on:submit.stop.prevent="save">
      <h1 class="form-title settings-title" v-if="$mq === 'desktop'">
        Story Settings
      </h1>
      <div class="form-title border-top">
        <div class="inner">
          <span class="semi-transparent">
            Messages
            <p class="subtext">
              Choose who can reply to your story
            </p>
          </span>
        </div>
      </div>
      <div class="shadow-block">
        <div class="container">
          <div class="form-group form-group_with-label radio-group">
            <label class="form-group-inner">
              <div class="radio-wrapper icn-item">
                <input
                  type="radio"
                  name="storyAnswerType"
                  value="all"
                  v-model="localUser.storyAnswerType"
                />
                <span class="label">
                  Everyone
                </span>
              </div>
            </label>
            <label class="form-group-inner">
              <div class="radio-wrapper icn-item">
                <input
                  type="radio"
                  name="storyAnswerType"
                  value="following"
                  v-model="localUser.storyAnswerType"
                />
                <span class="label">
                  People you follow
                </span>
              </div>
            </label>
            <label class="form-group-inner">
              <div class="radio-wrapper icn-item">
                <input
                  type="radio"
                  name="storyAnswerType"
                  value="off"
                  v-model="localUser.storyAnswerType"
                />
                <span class="label">
                  Off
                </span>
              </div>
            </label>
          </div>
        </div>
      </div>
      <div
        class="form-title border-top private-switcher-block private-story"
        :class="{ disabled: !localUser.isWantEarn }"
      >
        <div class="inner border-bottom-mobile">
          <span class="semi-transparent">
            Private Story
            <p class="subtext">
              Story visible only to subscribers
            </p>
          </span>
          <label class="toggle-element">
            <input
              type="checkbox"
              name="isPrivateStories"
              v-model="localUser.isPrivateStories"
              :disabled="!localUser.isWantEarn"
            />
            <span class="toggle-element_switcher"></span>
          </label>
        </div>
        <div
          class="text-enable-money border-bottom-mobile"
          v-if="!localUser.isWantEarn"
        >
          You need to enable <b>Earn Money</b> option in
          <router-link to="/settings/profile">Profile</router-link> settings to
          enable Private Story option.
        </div>
      </div>
      <div class="form-title border-top private-switcher-block private-story">
        <div class="inner border-bottom-mobile">
          <span class="semi-transparent">
            Followers Private
            <p class="subtext">
              Story visible only to followers (if you have a paid account
              enabled subscribers will see it too)
            </p>
          </span>
          <label class="toggle-element">
            <input
              type="checkbox"
              name="isPrivateStoriesFollowers"
              v-model="localUser.isPrivateStoriesFollowers"
            />
            <span class="toggle-element_switcher"></span>
          </label>
        </div>
      </div>
      <div class="container hidden-mobile" v-if="$mq === 'desktop'">
        <div class="form-group form-group_with-label">
          <button
            type="submit"
            class="btn lg btn_fix-width btn_form-gap"
            :disabled="!changed"
          >
            Save changes
          </button>
        </div>
      </div>
    </form>
    <BlockedUsers
      mobileBlockedRoute="/settings/story/blocked"
      source="stories"
      subtext="Your stories will be hidden from these users"
    />
  </div>
</template>

<script>
import SettingsCommonMixin from "@/mixins/settings/common";
import BlockedUsers from "../BlockedUsers";
import ucFirst from "@/helpers/ucFirst";

export default {
  name: "StorySettingsContent",

  mixins: [SettingsCommonMixin],

  components: {
    BlockedUsers
  },

  computed: {
    view() {
      return this.$route.params.view || "settingsStory";
    },
    viewClass() {
      return ucFirst(this.view) + "View";
    }
  }
};
</script>
