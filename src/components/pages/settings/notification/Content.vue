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

            <div
              v-if="isMonetizedUser"
              class="form-group notification-setting-row"
            >
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

            <div
              v-if="isMonetizedUser"
              class="form-group notification-setting-row"
            >
              <label class="form-group-inner">
                <span class="label label_cursor-default">
                  Tips notification frequency
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

            <div
              v-if="isMonetizedUser"
              class="form-group notification-setting-row"
            >
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

            <div
              v-if="isMonetizedUser"
              class="form-group notification-setting-row"
            >
              <label class="form-group-inner">
                <span class="label label_cursor-default">
                  Contest paid votes notification frequency
                </span>
                <span class="select-wrapper select-wrapper_short">
                  <select
                    name="emailNotificationClipPeriod"
                    v-model="localUser.emailNotificationContestVotesPeriod"
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
      <template v-if="isMonetizedUser">
        <div
          class="form-title border-top"
          :class="{ disabled: !user.twitterUsername }"
        >
          <div class="inner">
            <span class="semi-transparent">
              Send Twitter Notifications
            </span>
            <label class="toggle-element">
              <input
                type="checkbox"
                name="isTweetNotificationsEnabled"
                value="true"
                v-model="localUser.twitterNotificationsSettings.isEnabled"
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
                  !user.twitterUsername ||
                  !localUser.twitterNotificationsSettings.isEnabled
              }"
            >
              <label class="form-group-inner">
                <div class="checkbox-wrapper">
                  <input
                    v-model="
                      localUser.twitterNotificationsSettings.options
                        .newSubscriber.isEnabled
                    "
                    type="checkbox"
                    name="isEmailNotificationNewSubscriptionEnabled"
                    value="true"
                  />
                  <span class="label icn-item">New subscriber</span>
                </div>
                <div
                  class="inner customPreview_switcher"
                  :class="{
                    disabled: !localUser.twitterNotificationsSettings.options
                      .newSubscriber.isEnabled
                  }"
                >
                  <span class="semi-transparent label">
                    Custom previews
                  </span>
                  <label class="toggle-element">
                    <input
                      type="checkbox"
                      name="isTweetNotificationsEnabled"
                      value="true"
                      v-model="
                        localUser.twitterNotificationsSettings.options
                          .newSubscriber.customImages.isEnabled
                      "
                      :disabled="
                        !user.twitterUsername ||
                          !localUser.twitterNotificationsSettings.options
                            .newSubscriber.isEnabled
                      "
                    />
                    <span class="toggle-element_switcher"></span>
                  </label>
                </div>
              </label>
              <TwitterCustomPreviews
                v-if="
                  localUser.twitterNotificationsSettings.options.newSubscriber
                    .isEnabled &&
                    localUser.twitterNotificationsSettings.options.newSubscriber
                      .customImages.isEnabled
                "
                :media="
                  localUser.twitterNotificationsSettings.options.newSubscriber
                    .customImages.images
                "
                :name="'newSubscriber'"
              />

              <label class="form-group-inner">
                <div class="checkbox-wrapper">
                  <input
                    v-model="
                      localUser.twitterNotificationsSettings.options.autoprolong
                        .isEnabled
                    "
                    type="checkbox"
                    name="isTweetNotificationAutoprolongEnabled"
                    value="true"
                  />
                  <span class="label icn-item">Subscription renewals</span>
                </div>
                <div
                  class="inner customPreview_switcher"
                  :class="{
                    disabled: !localUser.twitterNotificationsSettings.options
                      .autoprolong.isEnabled
                  }"
                >
                  <span class="semi-transparent label">
                    Custom previews
                  </span>
                  <label class="toggle-element">
                    <input
                      type="checkbox"
                      name="isTweetNotificationsEnabled"
                      value="true"
                      v-model="
                        localUser.twitterNotificationsSettings.options
                          .autoprolong.customImages.isEnabled
                      "
                      :disabled="
                        !user.twitterUsername ||
                          !localUser.twitterNotificationsSettings.options
                            .autoprolong.isEnabled
                      "
                    />
                    <span class="toggle-element_switcher"></span>
                  </label>
                </div>
              </label>
              <TwitterCustomPreviews
                v-if="
                  localUser.twitterNotificationsSettings.options.autoprolong
                    .isEnabled &&
                    localUser.twitterNotificationsSettings.options.autoprolong
                      .customImages.isEnabled
                "
                :media="
                  localUser.twitterNotificationsSettings.options.autoprolong
                    .customImages.images
                "
                :name="'autoprolong'"
              />

              <label class="form-group-inner">
                <div class="checkbox-wrapper">
                  <input
                    v-model="
                      localUser.twitterNotificationsSettings.options.tip
                        .isEnabled
                    "
                    type="checkbox"
                    name="isTweetNotificationTipEnabled"
                    value="true"
                  />
                  <span class="label icn-item">Tips</span>
                </div>
                <div
                  class="inner customPreview_switcher"
                  :class="{
                    disabled: !localUser.twitterNotificationsSettings.options
                      .tip.isEnabled
                  }"
                >
                  <span class="semi-transparent label">
                    Custom previews
                  </span>
                  <label class="toggle-element">
                    <input
                      type="checkbox"
                      name="isTweetNotificationsEnabled"
                      value="true"
                      v-model="
                        localUser.twitterNotificationsSettings.options.tip
                          .customImages.isEnabled
                      "
                      :disabled="
                        !user.twitterUsername ||
                          !localUser.twitterNotificationsSettings.options.tip
                            .isEnabled
                      "
                    />
                    <span class="toggle-element_switcher"></span>
                  </label>
                </div>
              </label>
              <TwitterCustomPreviews
                v-if="
                  localUser.twitterNotificationsSettings.options.tip
                    .isEnabled &&
                    localUser.twitterNotificationsSettings.options.tip
                      .customImages.isEnabled
                "
                :media="
                  localUser.twitterNotificationsSettings.options.tip
                    .customImages.images
                "
                :name="'tip'"
              />

              <label class="form-group-inner">
                <div class="checkbox-wrapper">
                  <input
                    v-model="
                      localUser.twitterNotificationsSettings.options.post
                        .isEnabled
                    "
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
                    v-model="
                      localUser.twitterNotificationsSettings.options.clipSale
                        .isEnabled
                    "
                    type="checkbox"
                    name="isTweetNotificationClipSaleEnabled"
                    value="true"
                  />
                  <span class="label icn-item">Clip sales</span>
                </div>
              </label>

              <label class="form-group-inner">
                <div class="checkbox-wrapper">
                  <input
                    v-model="
                      localUser.twitterNotificationsSettings.options.onGoLive
                        .isEnabled
                    "
                    type="checkbox"
                    name="isPostsTweetsOnGoLive"
                    value="true"
                  />
                  <span class="label icn-item">Going Live</span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </template>
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
import SettingsCommonMixin from "@/mixins/settings/common";
import webPushNotifications from "@/mixins/webPushNotifications";
// import { twitterNotificationsSettings.options } from "@/mock/twitterNotificationsSettings.options";
import TwitterCustomPreviews from "./TwitterCustomPreviews";
import User from "@/mixins/user";

export default {
  name: "NotificationSettingsContent",
  mixins: [SettingsCommonMixin, webPushNotifications, User],
  components: {
    TwitterCustomPreviews
  },
  // data() {
  //   return {
  //     twitterNotificationsSettings.options: twitterNotificationsSettings.options
  //   };
  // },
  computed: {
    notifOptions() {
      return {
        none: "Disabled",
        now: "Immediately",
        day: "Daily",
        week: "Weekly"
      };
    }
    // settings() {
    //   return this.twitterNotificationsSettings.options;
    // }
  }
};
</script>
