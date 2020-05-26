<template>
  <Modal :onClose="close">
    <template slot="content">
      <div class="popup-container popup-massmes SubscribersGroupMessages">
        <div class="content content_relative">
          <div class="popup__header">
            Send message to {{ subscriberType }} subscribers
          </div>
          <div class="loader-container loader-container_center" v-if="loading">
            <Loader :fullscreen="false" :small="true" :semilight="true" />
          </div>
          <div class="border-top bg-gradient_light">
            <div class="popup__content">
              <div class="form-group form-group_clear-gaps">
                <label class="form-group-inner">
                  <span class="label">Choose group</span>
                  <div class="row">
                    <div
                      :class="{
                        'col-3-4': $mq === 'mobile',
                        'col-1-2': $mq === 'desktop'
                      }"
                    >
                      <div class="select-wrapper">
                        <select
                          v-model="subscriberType"
                          name="subscriberType"
                          class="default-disabled"
                        >
                          <option value="all">All</option>
                          <option value="active">Active</option>
                          <option value="expired">Expired</option>
                          <option value="paid">Paid</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </label>
                <div class="btn-post btn-post_datetime" v-if="!scheduledDate">
                  <div class="post-datetime">
                    <Datetime
                      :inputId="`post-datetime__switcher_mass-messages`"
                      class="post-datetime__switcher"
                      type="datetime"
                      v-model="scheduledDate"
                      input-class="post-datetime__input"
                      use12-hour
                      :min-datetime="minDate"
                      @close="closeDatepicker"
                      :phrases="{ ok: 'Schedule', cancel: 'Cancel' }"
                    />
                    <span
                      class="post-datetime__icn icn-item icn-calendar icn-size_lg"
                      @click="openDatepicker"
                    ></span>
                    <span class="">
                      Schedule
                    </span>
                  </div>
                </div>
                <div class="btn-post btn-post_datetime" v-else>
                  <div class="datetime-value">
                    <span class="post-datetime__value">{{
                      formattedDate
                    }}</span>
                    <span
                      @click="scheduledDate = undefined"
                      class="datetime-value__reset icn-item btn-reset btn-reset_prim-color icn-pos_center"
                    />
                  </div>
                </div>
              </div>
            </div>
            <AddMessageBox
              @send="submit"
              :withUser="user"
              :withFontSizeController="false"
              :withTips="false"
              :multipleMedia="true"
            />
            <button
              type="button"
              class="close close_shift-t close_default icn-item icn-size_lg close_visible-mob"
              @click="close"
            />
          </div>
        </div>
        <div
          class="scheduled-container popup-container-scroll"
          v-if="scheduledMessages.length"
        >
          <span class="scheduled-title">Scheduled messages</span>
          <div
            v-for="message in scheduledMessages"
            :key="message.id"
            class="scheduled-message"
          >
            <div class="scheduled-message__header">
              <div class="title">
                Message for <span>{{ message.recipients }}</span> subscribers
              </div>
              <div class="time">
                {{ scheduledFormattedDate(message.scheduledDate) }}
              </div>
              <span
                @click="deleteScheduleMessage(message.id)"
                class="icn icn-item icn-close"
              />
            </div>
            <div class="scheduled-message__content">
              <div v-if="message.media.length" class="images-container">
                <img
                  v-for="image in message.media"
                  :key="image.id"
                  alt="preview"
                  :src="image.thumb.source"
                  class="image-item"
                />
              </div>
              <div v-if="message.text" class="text-container">
                Text: {{ message.text }}
              </div>
              <div v-if="message.price">Price: ${{ message.price }}</div>
            </div>
          </div>
          <!-- <AddMessageBox
            @send="submit"
            :withUser="user"
            :withFontSizeController="false"
            :withTips="false"
            :multipleMedia="true"
          />
          <button
            type="button"
            class="close close_shift-t close_default icn-item icn-size_lg close_visible-mob"
            @click="close"
          /> -->
        </div>
      </div>
    </template>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import AddMessageBox from "@/components/chat/AddMessageBox";
import { Datetime } from "vue-datetime";
import { DateTime as LuxonDateTime } from "luxon";
import moment from "moment";
import Loader from "@/components/common/Loader";
// import scheduledMessages from "@/mock/scheduleMessages";

export default {
  name: "groupMessageModal",
  components: {
    Modal,
    AddMessageBox,
    Datetime,
    Loader
  },
  data() {
    return {
      subscriberType: "all",
      scheduledDate: undefined,
      scheduledMessages: [],
      loading: false
    };
  },
  computed: {
    title() {
      return !!this.$store.state.profile.links.editedLink;
    },
    user() {
      return this.$store.state.auth.user;
    },
    minDate() {
      return LuxonDateTime.local()
        .plus({ minutes: 1 })
        .toISO();
    },
    formattedDate() {
      return (
        "Scheduled for " + moment(this.scheduledDate).format("MMM D, hh:mm a")
      );
    }
  },
  methods: {
    close(e) {
      e.preventDefault();
      this.$store.dispatch("modal/hide", { name: "groupMessage" });
      this.$store.commit("profile/links/endEditLink");
    },
    async submit(data) {
      const body = {
        ...data,
        recipients: this.subscriberType,
        scheduledDate: this.scheduledDate
      };
      try {
        this.loading = true;
        await this.$store.dispatch("chat/sendGroupMessage", body);
        this.$store.commit("global/toastShowTrigger", {
          text: "Group message has sent",
          type: "success"
        });
      } catch (err) {
        this.$store.commit("global/toastShowTrigger", {
          text: err.message,
          type: "warning"
        });
      } finally {
        this.loading = false;
        this.$store.dispatch("modal/hide", { name: "groupMessage" });
      }
    },
    openDatepicker() {
      if (this.scheduledDate) return;
      document.body.classList.add("open-timepicker");
      document.getElementById(`post-datetime__switcher_mass-messages`).click();
    },
    closeDatepicker() {
      document.body.classList.remove("open-timepicker");
    },
    scheduledFormattedDate(date) {
      return "Scheduled for " + moment(date).format("MMM D, hh:mm a");
    },
    getScheduledMessages() {
      this.$store
        .dispatch("chat/getScheduledGroupMessages", null, { root: true })
        .then(res => {
          this.scheduledMessages = res.list;
        });
    },
    deleteScheduleMessage(messageId) {
      this.$store
        .dispatch("chat/deleteScheduleMessage", messageId, { root: true })
        .then(() => {
          this.scheduledMessages = this.scheduledMessages.filter(
            item => item.id !== messageId
          );
        });
    }
  },
  mounted() {
    this.getScheduledMessages();
  }
};
</script>
