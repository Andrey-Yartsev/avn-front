<template>
  <div class="contactsList">
    <scrolly class="contactsListContent">
      <scrolly-viewport ref="messages">
        <div
          @click="openChat(v.withUser.id)"
          class="chatView"
          v-for="v in chats" v-bind:key="v.withUser.id" :class="{active: v.active}"
        >
          <div class="avatar"></div>
          <div class="chatViewContent">
            <div class="chatView__header">
              <span class="name">{{ v.withUser.name }}</span>
              <span class="verified-user" v-if="v.withUser.isVerified"></span>
              <span class="user-login"><span class="username">{{ v.withUser.username }}</span></span>
              <div class="time" v-if="v.lastMessage">{{ messageTime(v.lastMessage) }}</div>
            </div>
            <div class="chatView__body">
              <p class="typing">
                <template v-if="v.lastMessage">
                  <span v-if="v.lastMessage.media.length" class="type-msg-icn type-msg-icn_media">x</span>
                  <span v-else class="message">{{ v.lastMessage.text }}</span>
                </template>
                <span class="isTyping">tester is typing...</span>
              </p>
            </div>
          </div>
        </div>
      </scrolly-viewport>
      <scrolly-bar axis="y"></scrolly-bar>
    </scrolly>
  </div>
</template>

<script>
import dateFns from "date-fns";
import { Scrolly, ScrollyViewport, ScrollyBar } from "vue-scrolly";

export default {
  name: "ChatContactList",

  components: {
    Scrolly,
    ScrollyViewport,
    ScrollyBar
  },

  props: {
    chats: {
      type: Array,
      required: true
    }
  },

  methods: {
    openChat(id) {
      this.$router.push("/chat/" + id);
    },
    messageTime(message) {
      return dateFns.distanceInWordsStrict(new Date(), message.changedAt);
    }
  }
};
</script>
