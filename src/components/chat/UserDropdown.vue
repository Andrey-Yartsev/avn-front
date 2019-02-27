<template>
  <span
    class="more-functions"
    :class="{ open: chatOptionsOpened }"
    v-click-outside="
      () => {
        chatOptionsOpened = false;
      }
    "
  >
    <div
      class="more-functions__overlay"
      @click="
        () => {
          chatOptionsOpened = false;
        }
      "
    ></div>
    <div
      class="more-functions__btn"
      @click="chatOptionsOpened = !chatOptionsOpened"
    ></div>
    <div class="more-functions__dropdown">
      <div class="more-functions__dropdown-inside">
        <ul>
          <li>
            <router-link class="profile-url" :to="'/' + activeUser.username"
              >View profile</router-link
            >
          </li>
          <li v-if="activeUser.isBlocked">
            <a class="menu-block" @click="unblockActiveUser">Unblock user</a>
          </li>
          <li v-else>
            <a class="menu-block" @click="blockActiveUser">Block user</a>
          </li>
          <template v-if="_canMute(activeUser)">
            <li v-if="activeUser.isMuted">
              <a @click="unmuteActiveUser">Unmute user</a>
            </li>
            <li v-else>
              <a @click="muteActiveUser">Mute user</a>
            </li>
          </template>
          <template v-if="hasMessages">
            <li v-if="deleteInProgress"><a>Deleting...</a></li>
            <li v-else>
              <a class="menu-delete" @click="deleteConversation"
                >Delete conversation</a
              >
            </li>
          </template>
          <li><a class="menu-report" @click="report">Report</a></li>
          <li>
            <a class="menu-cancel" @click="chatOptionsOpened = false">Cancel</a>
          </li>
        </ul>
      </div>
    </div>
  </span>
</template>

<script>
import ClickOutside from "vue-click-outside";
import Mute from "@/mixins/mute";

export default {
  name: "ChatUserDropdown",
  directives: {
    ClickOutside
  },
  mixins: [Mute],
  props: {
    activeUser: Object,
    hasMessages: Boolean,
    deleteInProgress: Boolean
  },
  data() {
    return {
      chatOptionsOpened: false
    };
  },
  methods: {
    blockActiveUser() {
      this.$store.dispatch("chat/blockUser", this.activeUser.id);
      this.chatOptionsOpened = false;
    },
    unblockActiveUser() {
      this.$store.dispatch("chat/unblockUser", this.activeUser.id);
      this.chatOptionsOpened = false;
    },
    muteActiveUser() {
      this.$store.dispatch("chat/muteUser", {
        user: this.activeUser,
        currentUser: this.user
      });
      this.chatOptionsOpened = false;
    },
    unmuteActiveUser() {
      this.$store.dispatch("chat/unmuteUser", {
        user: this.activeUser,
        currentUser: this.user
      });
      this.chatOptionsOpened = false;
    },
    report() {
      this.$store.dispatch("modal/show", {
        name: "userReport",
        data: this.activeUser.id
      });
      this.chatOptionsOpened = false;
    },
    deleteConversation() {
      this.$emit("deleteConversation");
      this.chatOptionsOpened = false;
    }
  }
};
</script>
