<template>
  <div class="SettingsNotificationsView">
    <form v-on:submit.stop.prevent="save">
      <h1 class="form-title" v-if="$mq === 'desktop'">Notifications Settings</h1>
      <div class="form-title border-top">
        <div class="inner">
          <span class="semi-transparent">
            Receive Email Notifications
          </span>
          <label class="toggle-element">
            <input
              type="checkbox"
              name="isEmailNotificationsEnabled"
              value="true"
              v-model="localUser.isEmailNotificationsEnabled"
            />
            <span></span>
          </label>
        </div>
      </div>
      <div class="shadow-block">
        <div class="container">
          <div
            class="form-group form-group_with-label checkbox-group emailNotificationsTypes"
            :class="{ disabled: !localUser.isEmailNotificationsEnabled }"
          >
            <label class="form-group-inner">
              <div class="checkbox-wrapper">
                <span class="checkbox-label">
                  <input
                    v-model="
                      localUser.isEmailNotificationNewSubscriptionEnabled
                    "
                    type="checkbox"
                    name="isEmailNotificationNewSubscriptionEnabled"
                    value="true"
                  />
                  <span></span>
                </span>
                <span class="label">New subscriber</span>
              </div>
            </label>
            <label class="form-group-inner">
              <div class="checkbox-wrapper">
                <span class="checkbox-label">
                  <input
                    v-model="
                      localUser.isEmailNotificationNewUnreadChatsMessagesEnabled
                    "
                    type="checkbox"
                    name="isEmailNotificationNewUnreadChatsMessagesEnabled"
                    value="true"
                  />
                  <span></span>
                </span>
                <span class="label">New private message</span>
              </div>
            </label>
            <label class="form-group-inner">
              <div class="checkbox-wrapper">
                <span class="checkbox-label">
                  <input
                    v-model="localUser.isEmailNotificationNewTipsEnabled"
                    type="checkbox"
                    name="isEmailNotificationNewTipsEnabled"
                    value="true"
                  />
                  <span></span>
                </span>
                <span class="label">Fund was received</span>
              </div>
            </label>
          </div>
        </div>
      </div>
      <div class="form-title border-top">
        <div class="inner">
          <span class="semi-transparent">
            Emails Frequency
            <p class="subtext">Choose how often you want to receive emails</p>
          </span>
        </div>
      </div>
      <div class="shadow-block">
        <div class="container">
          <div
            :class="{ disabled: !localUser.isEmailNotificationsEnabled }"
            class="form-group form-group_with-label radio-group emailNotificationsFrequency"
          >
            <label class="form-group-inner">
              <div class="radio-wrapper">
                <input
                  v-model="localUser.emailNotificationNewPostsPeriod"
                  type="radio"
                  name="emailNotificationNewPostsPeriod"
                  value="0"
                />
                <span class="radio"></span>
                <span class="label">Immediately</span>
              </div>
            </label>
            <label class="form-group-inner">
              <div class="radio-wrapper">
                <input
                  v-model="localUser.emailNotificationNewPostsPeriod"
                  type="radio"
                  name="emailNotificationNewPostsPeriod"
                  value="1"
                />
                <span class="radio"></span>
                <span class="label">Daily</span>
              </div>
            </label>
            <label class="form-group-inner">
              <div class="radio-wrapper">
                <input
                  v-model="localUser.emailNotificationNewPostsPeriod"
                  type="radio"
                  name="emailNotificationNewPostsPeriod"
                  value="2"
                />
                <span class="radio"></span>
                <span class="label">Weekly</span>
              </div>
            </label>
          </div>
        </div>
      </div>
      <div class="container hidden-mobile">
        <div class="form-group form-group_with-label">
          <button
            :disabled="loading || !changed"
            type="submit"
            class="btn lg saveChanges"
          >
            Save changes
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import Common from "../common";

export default {
  name: "NotificationSettingsContent",

  mixins: [Common]
};
</script>
