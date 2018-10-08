<template>
  <div class="chat-section">
    <div
      class="chatContent os-host os-theme-dark os-host-resize-disabled os-host-scrollbar-horizontal-hidden os-host-scrollbar-vertical-hidden os-host-transition">
      <div class="os-resize-observer-host">
        <div class="os-resize-observer observed" style="left: 0px; right: auto;"></div>
      </div>
      <div class="os-size-auto-observer" style="height: calc(100% + 1px); float: left;">
        <div class="os-resize-observer observed"></div>
      </div>
      <div class="os-content-glue" style="width: 540px; margin: 0px -20px; height: 788px;"></div>
      <div class="os-padding">
        <div class="os-viewport os-viewport-native-scrollbars-invisible" style="">
          <div class="os-content" style="padding: 0px 20px; height: 100%; width: 100%;">

            <div
              v-for="v in messages"
              v-bind:key="v.id"
              class="chatMessage notAuthorMessage withTime"
              :class="{
              authorMessage: isAuthorMessage(v),
              firstMessageInGroup: v.firstMessageInGroup
              }"
            >
              <div class="chatMessageWrapper">
                <div class="avatar">
                  <img :src="v.fromUser.avatar" v-if="v.fromUser.avatar">
                </div>
                <div class="messageContent">
                  <div class="messageWrapper ">
                    <span class="message">{{ v.text }}</span>
                  </div>
                  <div class="time">
                    <span class="status">-</span>
                    <span class="timeValue">{{ v.changedAt }}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div class="os-scrollbar os-scrollbar-horizontal os-scrollbar-unusable">
        <div class="os-scrollbar-track os-scrollbar-track-off">
          <div class="os-scrollbar-handle" style="width: 100%; transform: translate(0%, 0px);"></div>
        </div>
      </div>
      <div class="os-scrollbar os-scrollbar-vertical os-scrollbar-unusable">
        <div class="os-scrollbar-track os-scrollbar-track-off">
          <div class="os-scrollbar-handle" style="height: 100%; transform: translate(0px, 0%);">
          </div>
        </div>
      </div>
      <div class="os-scrollbar-corner"></div>

    </div>
  </div>
</template>

<script>
import userMixin from "@/mixins/user";

export default {
  name: "ChatMessages",

  mixins: [userMixin],

  props: {
    _messages: {
      type: Array,
      required: true
    }
  },

  computed: {
    messages() {
      return this._messages;
      // if (!this._messages.length) {
      //   return [];
      // }
      // return this.addGrouping(this._messages);
    }
  },

  methods: {
    isAuthorMessage(message) {
      return message.fromUser.id === this.user.id;
    },

    addGrouping(messages) {
      return this.setFirstInGroup(messages);
    },

    setFirstInGroup(messages) {
      // if only one message
      if (messages.length === 1) {
        messages[messages.length - 1].firstMessageInGroup = true;
      } else {
        for (var i = 0; i < messages.length; i++) {
          var currentModel = messages[i];
          // if very first message
          if (i === 0) {
            currentModel.firstMessageInGroup = true;
            continue;
          }

          var currentMine = this.checkAuthor(currentModel.fromUser);
          var isPrevNotMine = !this.checkAuthor(messages[i - 1].fromUser);
          //If current message is mine but not previous message set firstMessageInGroup flag
          if (
            (currentMine && isPrevNotMine) ||
            (!currentMine && !isPrevNotMine)
          ) {
            messages[i].firstMessageInGroup = true;
          }
        }
      }
      return messages;
    },

    setLastInGroup(messages) {
      // if only one message
      if (messages.length === 1) {
        messages[messages.length - 1].lastMessageInGroup = true;
      } else {
        for (let i = 0; i < messages.length; i++) {
          // if very last message
          if (i === messages.length - 1) {
            messages[i].lastMessageInGroup = true;
            return;
          }

          let currentMine = this.checkAuthor(messages[i].fromUser);
          let isNextNotMine = !this.checkAuthor(messages[i + 1].fromUser);
          // If current message is mine but not next message OR current message is not mine but next one is mine - set lastMessageInGroup flag
          if (
            (currentMine && isNextNotMine) ||
            (!currentMine && !isNextNotMine)
          ) {
            messages[i].lastMessageInGroup = true;
          }
        }
      }
    },

    checkAuthor(user) {
      return user.id === this.user.id;
    }
  }
};
</script>
