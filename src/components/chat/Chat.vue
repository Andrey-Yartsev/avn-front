<template>
  <Wrapper :mode="mode">
    <template slot="col1">
      <div
        class="chatCollectionContentWrapper chatCollectionContentWrapper_mob-height"
        v-if="!noMessages"
      >
        <ContactList
          :chats="chats"
          :mode="mode"
          :class="{ 'border-contacts': $mq === 'desktop' }"
        />
      </div>
    </template>

    <template slot="col2">
      <div
        v-if="isHome"
        class="start-chat-wrapper"
        :class="{ 'hidden-mobile': hasActiveChats }"
      >
        <div
          class="chatHeader chatHeader_add-shadow"
          :class="{ 'no-nav': $mq === 'mobile' }"
        >
          <div class="selectedChatHeader">
            You don't have any messages selected.
          </div>
        </div>
        <div class="chatCollectionContentWrapper">
          <div class="chatMessagesCollectionView">
            <div class="msg-no-chat">
              <div class="msg-no-chat__msg">
                Choose one of your existing message
                <br />or start
              </div>
              <span
                class="btn border md alt btn-start"
                @click="goTo('/chat/new')"
                >New message</span
              >
            </div>
          </div>
        </div>
      </div>
      <template v-else>
        <!-- <div class="chatCollectionContentWrapper" v-if="activeUserLoading">
          <Loader :fullscreen="false" text :small="true" />
        </div>-->
        <!-- <template v-else> -->
        <template>
          <div
            class="chatHeader chatHeader_add-shadow"
            :class="{ 'no-nav': $mq === 'mobile' }"
            v-if="activeUser"
          >
            <div class="selectedChatHeader">
              <div
                class="back-popup-btn hidden-desktop"
                v-if="$mq === 'mobile'"
              >
                <span class="back icn-item" @click="mobileBack"></span>
              </div>
              <router-link
                :to="'/' + activeUser.username"
                class="avatar avatar_gap-r-md avatar_sm hidden-mobile"
                :class="{ 'online-state': isOnline(activeUser.id) }"
              >
                <span class="avatar__img">
                  <img :src="activeUser.avatar" v-if="activeUser.avatar" />
                </span>
              </router-link>
              <div class="username-group">
                <router-link :to="'/' + activeUser.username" class="name">
                  {{ activeUser.name }}
                </router-link>
                <span
                  class="verified-user icn-item"
                  :class="{
                    fullyMonetized:
                      activeUser.canEarn && activeUser.canPayoutsRequest
                  }"
                  v-if="
                    activeUser.isVerified ||
                      (activeUser.canEarn && activeUser.canPayoutsRequest)
                  "
                ></span>
                <span class="user-login">
                  <router-link
                    class="username"
                    :to="'/' + activeUser.username"
                    >{{ activeUser.username }}</router-link
                  >
                </span>

                <div class="block-indicator" v-if="activeUser.isBlocked">
                  <span class="icn-block icn-item"></span>
                </div>
              </div>
              <div
                @click="togleNotes"
                class="notesIcon"
                :class="{ 'with-content': notes.text }"
                v-tooltip="'Notes'"
              >
                <span class="icn-item icn-edit" />
              </div>
              <UserDropdown
                :activeUser="activeUser"
                :hasMessages="!!messages.length"
                :deleteInProgress="deleteInProgress"
                @deleteConversation="deleteConversation"
              />
            </div>
          </div>
          <div class="chatCollectionContentWrapper">
            <div
              class="chatMessagesCollectionView"
              @dragover="dragOverHandler"
              @dragender="dragEnderHandler"
              @drop="dropHandler"
            >
              <template v-if="activeUser">
                <Messages :withUser="activeUser" />
                <AddMessage :withUser="activeUser" ref="addMessageSection" />
                <div
                  class="notes bg-gradient_light"
                  :class="{ visible: notes.show }"
                >
                  <textarea
                    placeholder="Enter notes here"
                    rows="7"
                    v-model="notes.text"
                  />
                </div>
              </template>
            </div>
          </div>
        </template>
      </template>
    </template>
    <NoConversations v-if="noMessages" />
  </Wrapper>
</template>

<script>
import User from "@/mixins/user";
import Wrapper from "./Wrapper";
import ContactList from "./ContactList";
import Messages from "./Messages";
import AddMessage from "./AddMessage";
import NoConversations from "./NoConversations";
import Loader from "@/components/common/Loader";
import MobileHeader from "@/components/header/Mobile";
import ModalRouterParams from "@/mixins/modalRouter/params";
import UserHeader from "@/components/header/User";
import UserDropdown from "./UserDropdown";
import Common from "./common";

let focusIntervalId = 0;

export default {
  name: "Chat",

  mixins: [User, ModalRouterParams, Common],

  components: {
    Wrapper,
    Messages,
    AddMessage,
    NoConversations,
    Loader,
    MobileHeader,
    ContactList,
    UserHeader,
    UserDropdown
  },

  data() {
    return {
      isTyping: false,
      deleteInProgress: false,
      virtualChat: null,
      dropedFiles: null,
      notes: {
        show: false,
        text: ""
      }
    };
  },

  computed: {
    isHome() {
      return this.routePath === "chat";
    },
    isNew() {
      return this.routePath === "chat/new";
    },
    noMessages() {
      return this.routePath === "chat/no-messages";
    },
    hasActiveChats() {
      return this.$store.state.chat.chats.some(v => v.hasHistory);
    },
    firstActiveChat() {
      return this.$store.state.chat.chats.find(v => v.hasHistory);
    },
    messages() {
      return this.$store.state.chat.messages;
    },
    activeUserId() {
      return parseInt(this.routeParams.userId);
    },
    activeChat() {
      return this.$store.state.chat.chats.find(v => v.id == this.activeUserId);
    },
    activeUser() {
      if (!this.activeChat) {
        return this.$store.state.chat.fetchActiveUserResult;
      }
      return this.activeChat.withUser;
    },
    blockLoading() {
      return (
        this.$store.state.user.blockLoading ||
        this.$store.state.user.unblockLoading
      );
    },
    activeUserLoading() {
      return this.$store.state.chat.fetchActiveUserLoading;
    }
  },

  watch: {
    activeUserId(activeUserId) {
      this.$store.commit("chat/messages", []);
      if (!activeUserId) {
        this.virtualChat = null;
        this.$store.commit("chat/setActiveUserId", null);
        return;
      }
      this.$store.commit("chat/setActiveUserId", activeUserId);
      this.$store.commit("chat/resetActiveUser");
      this.$store.dispatch(
        "chat/fetchFullActiveUser",
        this.activeUser.username
      );
      this.$store.commit("chat/resetMessages");
      this.fetchMessages();
      this.resetNotes();
      this.fetchNotes();
    }
  },

  methods: {
    deleteConversation() {
      this.deleteInProgress = true;
      this.$store.dispatch("chat/delete", this.activeUserId).then(() => {
        this.deleteInProgress = false;
        this.goTo("/chat");
      });
    },
    fetchMessages() {
      this.$store.dispatch("chat/fetchMessages", this.activeUserId);
    },
    fetchLastMessage() {
      return this.$store.dispatch("chat/fetchLastMessage", this.activeUserId);
    },
    mobileBack() {
      this.goTo("/chat");
    },
    openUserMobileBar() {
      this.$store.dispatch("global/openUserMobileBar");
    },
    initVirtualChat() {
      if (!this.activeChat) {
        const lastMessage = this.$store.state.chat.fetchLastMessageResult;
        const deletedUserChat = this.findDeletedUserChat(this.activeUserId);
        if (deletedUserChat) {
          this.virtualChat = { ...deletedUserChat };
          return;
        }
        this.$store
          .dispatch("chat/fetchActiveUser", this.activeUserId)
          .then(user => {
            this.virtualChat = {
              id: user.id,
              withUser: user,
              unreadMessagesCount: 0,
              lastMessage: lastMessage,
              createdAt: new Date()
            };
            this.$store.commit("chat/addNewChat", this.virtualChat);
          });
      }
    },
    findDeletedUserChat(userId) {
      return this.chats.find(v => v.id === userId && !v.withUser.id);
    },
    windowFocus() {
      if (!focusIntervalId) {
        this.$store.commit("chat/setActiveWindow", true);
        focusIntervalId = setInterval(() => {
          this.$store.dispatch("chat/markUnread");
        }, 1000);
      }
    },
    windowBlur() {
      this.$store.commit("chat/setActiveWindow", false);
      clearInterval(focusIntervalId);
      focusIntervalId = 0;
    },
    dragOverHandler(e) {
      e.preventDefault();
    },
    dragEnderHandler(e) {
      e.preventDefault();
    },
    dropHandler(e) {
      e.preventDefault();
      e.stopPropagation();
      let files = [...e.dataTransfer.files];
      this.$refs.addMessageSection.$children[0].handleDroppedFiles(files);
    },
    togleNotes() {
      if (this.notes.show) {
        this.saveNotes();
      }
      this.notes.show = !this.notes.show;
    },
    resetNotes() {
      this.notes.show = false;
      this.notes.text = "";
    },
    saveNotes() {
      this.$store.dispatch("chat/updateNotes", {
        text: this.notes.text.trim(),
        userId: this.activeUserId
      });
    },
    fetchNotes() {
      this.$store.dispatch("chat/fetchNotes", this.activeUserId).then(res => {
        this.notes.text = res;
      });
    }
  },
  created() {
    this.$store.commit("chat/resetChats");
    this.$store.commit("chat/messages", []);
    this.$store.dispatch("chat/fetchChats", true).then(() => {
      if (this.activeUserId) {
        this.$store.commit("chat/setActiveUserId", this.activeUserId);
        this.$store.commit("chat/resetActiveUser");
        if (this.activeUser) {
          this.$store.dispatch(
            "chat/fetchFullActiveUser",
            this.activeUser.username
          );
        }
        this.fetchMessages();
        this.fetchNotes();
        if (!this.activeChat) {
          this.fetchLastMessage().then(() => {
            this.initVirtualChat();
          });
        }
      }
    });
    window.addEventListener("focus", this.windowFocus);
    window.addEventListener("blur", this.windowBlur);
  },

  beforeDestroy() {
    this.$store.commit("chat/resetChats");
    this.$store.commit("chat/messages", []);
    this.$store.commit("chat/fetchChatsReset");
    window.removeEventListener("focus", this.windowFocus);
    window.removeEventListener("blur", this.windowBlur);
    this.resetNotes();
  }
};
</script>
