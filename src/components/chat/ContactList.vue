<template>
  <div class="contactsList">
    <VuePerfectScrollbar class="contactsListContent" ref="messages">
      <div
        @click="openChat(v.withUser.id)"
        class="chatView"
        v-for="v in chats"
        v-bind:key="v.withUser.id"
        :class="{
          active: v.active,
          unread: !!v.unreadMessagesCount,
          disabled: _isMuted(v.withUser)
        }"
      >
        <div class="avatar avatar_md">
          <span class="avatar__img">
            <img :src="v.withUser.avatar" v-if="v.withUser.avatar" />
          </span>
        </div>
        <div class="chatViewContent">
          <div class="chatView__header">
            <span class="name">{{ v.withUser.name }}</span>
            <span class="verified-user" v-if="v.withUser.isVerified"></span>
            <span class="user-login"
              ><span class="username">{{ v.withUser.username }}</span></span
            >
            <div class="time" v-if="v.lastMessage">
              {{ messageTime(v.lastMessage) }}
            </div>
          </div>
          <div class="chatView__body">
            <p class="typing">
              <template v-if="v.lastMessage">
                <span
                  v-if="v.lastMessage.media.length"
                  class="type-msg-icn type-msg-icn_media"
                  >x</span
                >
                <span v-else class="message">
                  <span
                    v-if="v.lastMessage.isTips"
                    class="type-msg-icn type-msg-icn_tips"
                    >x</span
                  >
                  <template v-else>{{
                    stripHtml(v.lastMessage.text)
                  }}</template>
                </span>
              </template>
              <span class="isTyping">tester is typing...</span>
            </p>
          </div>
        </div>
      </div>
    </VuePerfectScrollbar>
  </div>
</template>

<script>
import dateFns from "date-fns";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import ModalRouterGoto from "@/mixins/modalRouter/goto";
import Mute from "./mute";

export default {
  name: "ChatContactList",

  mixins: [ModalRouterGoto, Mute],

  components: {
    VuePerfectScrollbar
  },

  props: {
    chats: {
      type: Array,
      required: true
    }
  },

  methods: {
    openChat(id) {
      this.goTo("/chat/" + id);
    },
    messageTime(message) {
      return dateFns.distanceInWordsStrict(new Date(), message.changedAt);
    },
    stripHtml(html) {
      const tmp = document.createElement("DIV");
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || "";
    }
  }
};
</script>
