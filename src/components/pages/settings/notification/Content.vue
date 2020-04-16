<template>
  <div class="SettingsNotificationsView">
    <form v-on:submit.stop.prevent="save">
      <h1 class="form-title settings-title" v-if="$mq === 'desktop'">
        Notifications Settings
      </h1>
      <div class="form-title border-top border-bottom-mobile">
        <div class="inner">
          <span class="semi-transparent">
            Push Notifications
            <p class="subtext">Receive WebPush about</p>
          </span>
          <label class="toggle-element">
            <input
              type="checkbox"
              name="webPushes"
              v-model="webPushes"
              :disabled="disableBtn"
              @change="changeWP"
            />
            <span class="toggle-element_switcher"></span>
          </label>
        </div>
      </div>
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
            <span class="toggle-element_switcher"></span>
          </label>
        </div>
      </div>

      <div class="shadow-block">
        <div class="container">
          <div
            class="form-group form-group_side-gap emailNotificationsTypes"
            :class="{ disabled: !localUser.isEmailNotificationsEnabled }"
          >
            <label class="form-group-inner notification-checkbox-switcher">
              <div class="checkbox-wrapper">
                <input
                  v-model="
                    localUser.isEmailNotificationNewUnreadChatsMessagesEnabled
                  "
                  type="checkbox"
                  name="isEmailNotificationNewUnreadChatsMessagesEnabled"
                  value="true"
                />
                <span class="label icn-item">New private message</span>
              </div>
            </label>

            <!-- <label class="form-group-inner notification-checkbox-switcher">
              <div class="checkbox-wrapper">
                <input
                  v-model="localUser.isEmailNotificationClipSaleEnabled"
                  type="checkbox"
                  name="isEmailNotificationClipSaleEnabled"
                  value="true"
                />
                <span class="label icn-item">Clip sales</span>
              </div>
            </label> -->

            <div class="form-group notification-setting-row">
              <label class="form-group-inner">
                <span class="label label_cursor-default">
                  Subscription notification frequency
                </span>
                <span class="select-wrapper select-wrapper_short">
                  <select
                    name="emailNotificationSubscriptionPeriod"
                    v-model="localUser.emailNotificationSubscriptionPeriod"
                  >
                    <option v-for="(v, k) in notifOptions" :key="k" :value="k"
                      >{{ v }}
                    </option>
                  </select>
                </span>
              </label>
            </div>

            <div class="form-group notification-setting-row">
              <label class="form-group-inner">
                <span class="label label_cursor-default">
                  Tip notification frequency
                </span>
                <span class="select-wrapper select-wrapper_short">
                  <select
                    name="emailNotificationTipPeriod"
                    v-model="localUser.emailNotificationTipPeriod"
                  >
                    <option v-for="(v, k) in notifOptions" :key="k" :value="k"
                      >{{ v }}
                    </option>
                  </select>
                </span>
              </label>
            </div>

            <div class="form-group notification-setting-row">
              <label class="form-group-inner">
                <span class="label label_cursor-default">
                  Post notification frequency
                </span>
                <span class="select-wrapper select-wrapper_short">
                  <select
                    name="emailNotificationPostPeriod"
                    v-model="localUser.emailNotificationPostPeriod"
                  >
                    <option v-for="(v, k) in notifOptions" :key="k" :value="k"
                      >{{ v }}
                    </option>
                  </select>
                </span>
              </label>
            </div>

            <div class="form-group notification-setting-row">
              <label class="form-group-inner">
                <span class="label label_cursor-default">
                  Clip sales notification frequency
                </span>
                <span class="select-wrapper select-wrapper_short">
                  <select
                    name="emailNotificationClipPeriod"
                    v-model="localUser.emailNotificationClipPeriod"
                  >
                    <option v-for="(v, k) in notifOptions" :key="k" :value="k"
                      >{{ v }}
                    </option>
                  </select>
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div
        class="form-title border-top"
        :class="{ disabled: !user.twitterUsername }"
      >
        <div class="inner">
          <span class="semi-transparent">
            Receive Twitter Notifications
          </span>
          <label class="toggle-element">
            <input
              type="checkbox"
              name="isTweetNotificationsEnabled"
              value="true"
              v-model="localUser.isTweetNotificationsEnabled"
              :disabled="!user.twitterUsername"
            />
            <span class="toggle-element_switcher"></span>
          </label>
        </div>
      </div>
      <div class="shadow-block">
        <div class="container">
          <div
            class="form-group form-group_with-label checkbox-group emailNotificationsTypes"
            :class="{
              disabled:
                !user.twitterUsername || !localUser.isTweetNotificationsEnabled
            }"
          >
            <label class="form-group-inner">
              <div class="checkbox-wrapper">
                <input
                  v-model="localUser.isTweetNotificationNewSubscriberEnabled"
                  type="checkbox"
                  name="isEmailNotificationNewSubscriptionEnabled"
                  value="true"
                />
                <span class="label icn-item">New subscriber</span>
              </div>
            </label>
            <label class="form-group-inner">
              <div class="checkbox-wrapper">
                <input
                  v-model="localUser.isTweetNotificationAutoprolongEnabled"
                  type="checkbox"
                  name="isTweetNotificationAutoprolongEnabled"
                  value="true"
                />
                <span class="label icn-item">Subscription renewals</span>
              </div>
            </label>
            <label class="form-group-inner">
              <div class="checkbox-wrapper">
                <input
                  v-model="localUser.isPostsTweets"
                  type="checkbox"
                  name="isEmailNotificationNewTipsEnabled"
                  value="true"
                />
                <span class="label icn-item">Post tweets</span>
              </div>
            </label>
            <label class="form-group-inner">
              <div class="checkbox-wrapper">
                <input
                  v-model="localUser.isTweetNotificationClipSaleEnabled"
                  type="checkbox"
                  name="isTweetNotificationClipSaleEnabled"
                  value="true"
                />
                <span class="label icn-item">Clip sales</span>
              </div>
            </label>
          </div>
        </div>
      </div>
      <div class="container hidden-mobile" v-if="$mq === 'desktop'">
        <div class="form-group form-group_with-label">
          <button
            :disabled="loading || !changed"
            type="submit"
            class="btn lg btn_fix-width saveChanges btn_form-gap"
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
import webPushNotifications from "@/mixins/webPushNotifications";

export default {
  name: "NotificationSettingsContent",
  mixins: [Common, webPushNotifications],
  computed: {
    notifOptions() {
      return {
        none: "Disabled",
        now: "Immediately",
        day: "Daily",
        week: "Weekly"
      };
    }
  }
};
</script>
