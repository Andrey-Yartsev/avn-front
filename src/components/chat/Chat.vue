<template>
  <Wrapper :mode="mode">
    <template slot="col1">
      <div
        class="chatCollectionContentWrapper chatCollectionContentWrapper_mob-height"
        v-if="!noMessages"
      >
        <ContactList :chats="chats" :mode="mode" />
      </div>
    </template>

    <template slot="col2">
      <div
        v-if="isHome"
        class="start-chat-wrapper"
        :class="{ 'hidden-mobile': hasActiveChats }"
      >
        <div class="chatHeader chatHeader_add-shadow no-nav">
          <div class="selectedChatHeader">
            You don't have any messages selected.
          </div>
        </div>
        <div class="chatCollectionContentWrapper">
          <div class="chatMessagesCollectionView">
            <div class="msg-no-chat">
              <div class="msg-no-chat__msg">
                Chose one from your existing messages,<br />or start
              </div>
              <span class="btn-start" @click="goTo('/chat/new')"
                >New message</span
              >
            </div>
          </div>
        </div>
      </div>
      <template v-else>
        <div class="chatCollectionContentWrapper" v-if="activeUserLoading">
          <Loader :fullscreen="false" text="" class="transparent small" />
        </div>
        <template v-else>
          <div
            class="chatHeader chatHeader_add-shadow no-nav"
            v-if="activeUser"
          >
            <div class="selectedChatHeader">
              <div class="back-popup-btn hidden-desktop">
                <span class="back" @click="mobileBack"></span>
              </div>
              <router-link
                :to="'/' + activeUser.name"
                class="avatar avatar_gap-r-md avatar_sm hidden-mobile"
              >
                <span class="avatar__img">
                  <img :src="activeUser.avatar" v-if="activeUser.avatar" />
                </span>
              </router-link>
              <router-link :to="'/' + activeUser.username" class="name">
                {{ activeUser.name }}
              </router-link>
              <span class="verified-user" v-if="activeUser.isVerified"></span>
              <span class="user-login">
                <router-link class="username" :to="'/' + activeUser.username">{{
                  activeUser.username
                }}</router-link>
              </span>

              <div class="block-indicator">
                <span class="user-login" v-if="blockLoading">...</span>
                <span
                  class="icn-block icn-item"
                  v-else-if="activeUser.isBlocked"
                ></span>
              </div>

              <span
                class="more-functions"
                :class="{ open: chatOptionsOpened }"
                v-click-outside="
                  () => {
                    chatOptionsOpened = false;
                  }
                "
              >
                <div class="more-functions__overlay"></div>
                <div
                  class="more-functions__btn"
                  @click="chatOptionsOpened = !chatOptionsOpened"
                ></div>
                <div class="more-functions__dropdown">
                  <div class="more-functions__dropdown-inside">
                    <ul>
                      <li>
                        <router-link
                          class="profile-url"
                          :to="'/' + activeUser.username"
                          >View profile</router-link
                        >
                      </li>
                      <li v-if="activeUser.isBlocked">
                        <a class="menu-block" @click="unblockActiveUser"
                          >Unblock user</a
                        >
                      </li>
                      <li v-else>
                        <a class="menu-block" @click="blockActiveUser"
                          >Block user</a
                        >
                      </li>
                      <li v-if="activeUser.isMuted">
                        <a @click="unmuteActiveUser">Unmute user</a>
                      </li>
                      <li v-else>
                        <a @click="muteActiveUser">Mute user</a>
                      </li>
                      <template v-if="messages.length">
                        <li v-if="deleteInProgress"><a>Deleting...</a></li>
                        <li v-else>
                          <a class="menu-delete" @click="deleteConversation"
                            >Delete conversation</a
                          >
                        </li>
                      </template>
                      <li><a class="menu-report" @click="report">Report</a></li>
                      <li>
                        <a
                          class="menu-cancel"
                          @click="chatOptionsOpened = false"
                          >Cancel</a
                        >
                      </li>
                    </ul>
                  </div>
                </div>
              </span>
            </div>
          </div>
          <div class="chatCollectionContentWrapper">
            <div class="chatMessagesCollectionView">
              <div
                class="chat-section chat-section_loading"
                v-if="messagesLoading"
              >
                <Loader :fullscreen="false" text="" class="transparent small" />
              </div>
              <template v-if="activeUser">
                <Messages
                  v-if="messages"
                  :_messages="messages"
                  :withUser="activeUser"
                />
                <AddMessage :withUser="activeUser" />
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
import ClickOutside from "vue-click-outside";
import ModalRouterParams from "@/mixins/modalRouter/params";
import UserHeader from "@/components/header/User";

export default {
  name: "Chat",

  mixins: [User, ModalRouterParams],

  directives: {
    ClickOutside
  },

  components: {
    Wrapper,
    Messages,
    AddMessage,
    NoConversations,
    Loader,
    MobileHeader,
    ContactList,
    UserHeader
  },

  data() {
    return {
      chatOptionsOpened: false,
      isTyping: false,
      deleteInProgress: false,
      virtualChat: null
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
    chats() {
      let chats = this.$store.state.chat.chats.map(v => {
        const copy = { ...v };
        if (Object.keys(copy.lastMessage).length === 0) {
          copy.lastMessage = null;
        }
        if (this.activeUserId === copy.withUser.id) {
          copy.active = true;
        }
        return copy;
      });
      if (this.virtualChat) {
        if (chats.find(v => v.withUser.id === this.virtualChat.withUser.id)) {
          return chats;
        }
        let virtualChat = Object.assign({}, this.virtualChat);
        virtualChat.active = !this.activeChat;
        chats.push(virtualChat);
      }
      chats = chats.sort((a, b) => {
        let d1, d2;
        if (a.lastMessage) {
          d1 = new Date(a.lastMessage.changedAt);
        } else if (a.changedAt) {
          d1 = a.changedAt;
        }
        if (b.lastMessage) {
          d2 = new Date(b.lastMessage.changedAt);
        } else if (b.changedAt) {
          d2 = b.changedAt;
        }
        if (!d1 || !d2) {
          return -1;
        }
        return d2 - d1;
      });
      return chats;
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
      return this.$store.state.chat.chats.find(
        v => v.withUser.id === this.activeUserId
      );
    },
    activeUser() {
      if (!this.activeChat) {
        return this.$store.state.chat.fetchActiveUserResult;
      }
      return this.activeChat.withUser;
    },
    messagesLoading() {
      return this.$store.state.chat.fetchMessagesLoading;
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
      this.fetchMessages();
    }
  },

  methods: {
    blockActiveUser() {
      this.$store.dispatch("chat/blockUser", this.activeUserId);
      this.chatOptionsOpened = false;
    },
    unblockActiveUser() {
      this.$store.dispatch("chat/unblockUser", this.activeUserId);
      this.chatOptionsOpened = false;
    },
    muteActiveUser() {
      this.$store.dispatch("chat/muteUser", this.activeUser);
      this.chatOptionsOpened = false;
    },
    unmuteActiveUser() {
      this.$store.dispatch("chat/unmuteUser", this.activeUser);
      this.chatOptionsOpened = false;
    },
    deleteConversation() {
      this.deleteInProgress = true;
      this.$store.dispatch("chat/delete", this.activeUserId).then(() => {
        this.deleteInProgress = false;
        this.chatOptionsOpened = false;
        this.goTo("/chat");
      });
    },
    report() {
      this.$store.dispatch("modal/show", {
        name: "userReport",
        data: this.activeUserId
      });
      this.chatOptionsOpened = false;
    },
    fetchMessages() {
      this.$store.dispatch("chat/fetchMessages", this.activeUserId);
    },
    mobileBack() {
      this.goTo("/chat");
    },
    openUserMobileBar() {
      this.$store.dispatch("global/openUserMobileBar");
    },
    initVirtualChat() {
      if (!this.activeChat) {
        this.$store
          .dispatch("chat/fetchActiveUser", this.activeUserId)
          .then(user => {
            this.virtualChat = {
              lastMessage: null,
              withUser: user,
              changedAt: new Date()
            };
          });
      }
    }
  },

  created() {
    this.$store.commit("chat/messages", []);
    this.$store.dispatch("chat/fetchChats").then(() => {
      if (this.activeUserId) {
        this.$store.commit("chat/setActiveUserId", this.activeUserId);
        this.fetchMessages();
        this.initVirtualChat();
      }
    });
  },

  beforeDestroy() {
    this.$store.commit("chat/messages", []);
    this.$store.commit("chat/resetChats");
  }
};
</script>
