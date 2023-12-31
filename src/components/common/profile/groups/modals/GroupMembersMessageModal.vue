<template>
  <Modal :onClose="close">
    <template slot="content">
      <div class="popup-container popup-massmes GroupsGroupMessages">
        <div class="content content_relative">
          <div class="popup__header">
            Send message to the group
          </div>
          <div class="loader-container loader-container_center" v-if="loading">
            <Loader :fullscreen="false" :small="true" :semilight="true" />
          </div>
          <div class="border-top bg-gradient_light">
            <div class="popup__content">
              <div class="form-group form-group_clear-gaps">
                <div class="btn-post btn-post_datetime" v-if="!scheduledDate">
                  <div class="post-datetime">
                    <Datetime
                      :inputId="`post-datetime__switcher_mass-messages-group`"
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
              <div class="b-check-state b-check-state_post withStars-form">
                <label>
                  <input
                    class="is-free-post"
                    type="checkbox"
                    v-model="excludeStars"
                  />
                  <span class="b-check-state__icon icn-item icn-size_lg"></span>
                  <span class="b-check-state__text">Exclude all AVN Stars</span>
                </label>
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
        </div>
      </div>
    </template>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import AddMessageBox from "@/components/chat/AddMessageBox";
import { Datetime } from "vue-datetime";
import { formatISO, addMinutes, format } from "date-fns";
import Loader from "@/components/common/Loader";
// import scheduledMessages from "@/mock/scheduleMessages";

export default {
  name: "GroupMembersMessageModal",
  components: {
    Modal,
    AddMessageBox,
    Datetime,
    Loader
  },
  data() {
    return {
      scheduledDate: undefined,
      scheduledMessages: [],
      loading: false,
      excludeStars: true
    };
  },
  computed: {
    data() {
      return this.$store.state.modal.groupMembersMessage.data;
    },
    group() {
      return this.data.group;
    },
    user() {
      return this.$store.state.auth.user;
    },
    minDate() {
      const date = new Date();
      return formatISO(addMinutes(date, 1));
    },
    formattedDate() {
      return (
        "Scheduled for " +
        format(new Date(this.scheduledDate), "MMM d, h:mm aaaa")
      );
    }
  },
  methods: {
    close(e) {
      e.preventDefault();
      this.$store.dispatch("modal/hide", { name: "groupMembersMessage" });
    },
    async submit(data) {
      const body = {
        ...data,
        scheduledDate: this.scheduledDate,
        recipients: "list",
        listId: this.group.productId,
        withStars: !this.excludeStars
      };
      try {
        this.loading = true;
        await this.$store.dispatch("profile/groups/sendMessage", body);
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
        this.$store.dispatch("modal/hide", { name: "groupMembersMessage" });
      }
    },
    openDatepicker() {
      if (this.scheduledDate) return;
      document.body.classList.add("open-timepicker");
      document
        .getElementById(`post-datetime__switcher_mass-messages-group`)
        .click();
    },
    closeDatepicker() {
      document.body.classList.remove("open-timepicker");
    },
    scheduledFormattedDate(date) {
      return "Scheduled for " + format(new Date(date), "MMM d, h:mm aaaa");
    },
    getScheduleMessages() {
      this.$store
        .dispatch("profile/groups/getScheduleMessages", this.group.productId, {
          root: true
        })
        .then(res => {
          this.scheduledMessages = res.list;
        });
    },
    deleteScheduleMessage(messageId) {
      const data = {
        productId: this.group.productId,
        messageId
      };
      this.$store
        .dispatch("profile/groups/deleteScheduleMessage", data, { root: true })
        .then(() => {
          this.scheduledMessages = this.scheduledMessages.filter(
            item => item.id !== messageId
          );
        });
    }
  },
  mounted() {
    this.getScheduleMessages();
  }
};
</script>
