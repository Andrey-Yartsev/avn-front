<template>
  <div :class="viewClass">
    <form class="story-form" v-on:submit.stop.prevent="save">
      <h1 class="form-title" v-if="$mq === 'desktop'">
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
              <div class="radio-wrapper">
                <input
                  type="radio"
                  name="storyAnswerType"
                  value="all"
                  v-model="localUser.storyAnswerType"
                />
                <span class="radio"></span>
                <span class="label">
                  Everyone
                </span>
              </div>
            </label>
            <label class="form-group-inner">
              <div class="radio-wrapper">
                <input
                  type="radio"
                  name="storyAnswerType"
                  value="following"
                  v-model="localUser.storyAnswerType"
                />
                <span class="radio"></span>
                <span class="label">
                  People you follow
                </span>
              </div>
            </label>
            <label class="form-group-inner">
              <div class="radio-wrapper">
                <input
                  type="radio"
                  name="storyAnswerType"
                  value="off"
                  v-model="localUser.storyAnswerType"
                />
                <span class="radio"></span>
                <span class="label">
                  Off
                </span>
              </div>
            </label>
          </div>
        </div>
      </div>
      <div class="form-title border-top private-switcher-block private-story">
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
            />
            <span></span>
          </label>
        </div>
      </div>
      <div class="container hidden-mobile">
        <div class="form-group form-group_with-label">
          <button
            type="submit"
            class="btn lg btn_fix-width saveChanges"
            :disabled="!changed"
          >
            Save changes
          </button>
        </div>
      </div>
    </form>
    <BlockedUsers mobileBlockedRoute="/settings/story/blocked" />
  </div>
</template>

<script>
import Common from "../common";
import BlockedUsers from "../BlockedUsers";
import ucFirst from "@/helpers/ucFirst";

export default {
  name: "StorySettingsContent",

  mixins: [Common],

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
