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
        <ul class="more-functions__list">
          <li class="more-functions__item" v-if="userExists">
            <router-link
              class="profile-url more-functions__link"
              :to="'/' + _user.username"
              ><span class="more-functions__option"
                >View profile</span
              ></router-link
            >
          </li>
          <li class="more-functions__item">
            <a class="more-functions__link" @click="showAttachments"
              ><span class="more-functions__option">Show attachments</span></a
            >
          </li>
          <template v-if="userExists">
            <li class="more-functions__item" v-if="_user.isBlocked">
              <a
                class="menu-block more-functions__link"
                @click="unblockActiveUser"
              >
                <span class="more-functions__option">
                  Unblock user
                </span>
              </a>
            </li>
            <li class="more-functions__item" v-else>
              <a
                class="menu-block more-functions__link"
                @click="blockActiveUser"
              >
                <span class="more-functions__option">
                  Block user
                </span>
              </a>
            </li>
          </template>
          <template v-if="userExists && _canMute(_user)">
            <li class="more-functions__item" v-if="_user.isMuted">
              <a @click="unmuteActiveUser" class="more-functions__link">
                <span class="more-functions__option">
                  Unmute user
                </span>
              </a>
            </li>
            <li class="more-functions__item" v-else>
              <a @click="muteActiveUser" class="more-functions__link">
                <span class="more-functions__option">
                  Mute user
                </span>
              </a>
            </li>
          </template>
          <template v-if="hasMessages">
            <li v-if="deleteInProgress" class="more-functions__item">
              <div class="more-functions__link">
                <span class="more-functions__option">Deleting...</span>
              </div>
            </li>
            <li class="more-functions__item" v-else>
              <a
                class="menu-delete more-functions__link"
                @click="deleteConversation"
              >
                <span class="more-functions__option">
                  Delete conversation
                </span>
              </a>
            </li>
          </template>
          <li class="more-functions__item" v-if="userExists">
            <a class="menu-report more-functions__link" @click="report">
              <span class="more-functions__option">
                Report
              </span>
            </a>
          </li>
          <li class="more-functions__item">
            <a
              class="menu-cancel more-functions__link"
              @click="chatOptionsOpened = false"
            >
              <span class="more-functions__option">
                Cancel
              </span>
            </a>
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
  computed: {
    userExists() {
      return !!this.activeUser.id && this.activeUser.active;
    },
    fullUser() {
      return this.$store.state.chat.fetchFullActiveUserResult;
    },
    _user() {
      return this.fullUser || this.activeUser;
    }
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
      this.$store.dispatch("modal/show", {
        name: "confirm",
        data: {
          title: "All messages will be deleted",
          success: () => {
            this.$emit("deleteConversation");
          }
        }
      });
      this.chatOptionsOpened = false;
    },
    showAttachments() {
      this.$store.dispatch("modal/show", {
        name: "chatAttachments",
        data: this.activeUser.id
      });
      this.chatOptionsOpened = false;
    }
  }
};
</script>
