<template>
  <Wrapper :mode="mode">
    <template slot="col1">
      <div class="chatHeader chatHeader_add-shadow">
        <div class="contactsListHeader">
          <a
            :href="'/' + user.username"
            class="avatar header-avatar"
            @click.prevent="openUserMobileBar"
          >
            <img v-if="user.avatar" :src="user.avatar">
          </a>
          <h3>Messages</h3>
          <div class="newMessage-link">
            <a
              href="/chat/new"
              @click.prevent="goTo('/chat/new')"
              class="newMessage"
            >New message
            </a>
          </div>
        </div>
      </div>

      <MobileHeader />

      <div
        class="chatCollectionContentWrapper chatCollectionContentWrapper_mob-height"
        v-if="!noMessages"
      >
        <ContactList :chats="chats" :mode="mode" />
      </div>
    </template>

    <template slot="col2">
      <div v-if="isHome" class="start-chat-wrapper">
          <div class="chatHeader chatHeader_add-shadow no-nav">
            <div class="selectedChatHeader">
              You don't have any messages selected.
            </div>
          </div>
          <div class="chatCollectionContentWrapper">
            <div class="chatMessagesCollectionView">
              <div class="msg-no-chat">
                <div class="msg-no-chat__msg">
                  Chose one from your existing messages,<br>or start
                </div>
                <span class="btn-start" @click="goTo('/chat/new')">New message</span>
              </div>
            </div>
          </div>
      </div>
      <template v-else>
        <div class="chatHeader chatHeader_add-shadow no-nav" v-if="activeChat">
          <div class="selectedChatHeader">
            <div class="back-popup-btn hidden-desktop">
              <span class="back" @click="mobileBack"></span>
            </div>
            <router-link :to="'/' + activeUser.name" class="avatar">
              <img :src="activeUser.avatar" v-if="activeUser.avatar"/>
            </router-link>
            <router-link :to="'/' + activeUser.username" class="name">
              {{ activeUser.name }}
            </router-link>
            <span class="verified-user" v-if="activeUser.isVerified"></span>
            <span class="user-login">
            <router-link class="username" :to="'/' + activeUser.username">{{ activeUser.username }}</router-link>
          </span>

            <span class="user-login" v-if="blockLoading">...</span>
            <span class="user-login" v-else-if="activeUser.isBlocked">[blocked]</span>

            <span
              class="more-functions" :class="{open: chatOptionsOpened}"
              v-click-outside="() => {chatOptionsOpened = false}"
            >
              <div class="more-functions__overlay"></div>
              <div class="more-functions__btn" @click="chatOptionsOpened = !chatOptionsOpened"></div>
              <div class="more-functions__dropdown">
                <div class="more-functions__dropdown-inside">
                  <ul>
                  <li><router-link class="profile-url" :to="'/' + activeUser.name">View profile</router-link></li>
                  <li v-if="activeUser.isBlocked"><a class="menu-block" @click="unblockActiveUser">Unblock user</a></li>
                  <li v-else><a class="menu-block" @click="blockActiveUser">Block user</a></li>
                  <template v-if="messages.length">
                    <li v-if="deleteInProgress"><a>Deleting...</a></li>
                    <li v-else><a class="menu-delete" @click="deleteConversation">Delete conversation</a></li>
                  </template>
                  <li><a class="menu-report" @click="report">Report</a></li>
                  <li><a class="menu-cancel" @click="chatOptionsOpened = false">Cancel</a></li>
                  </ul>
                </div>
              </div>
            </span>

          </div>
        </div>
        <div class="chatCollectionContentWrapper">
          <div class="chatMessagesCollectionView">
            <div class="chat-section chat-section_loading" v-if="messagesLoading">
              <Loader :fullscreen="false" text="" class="transparent small"/>
            </div>
            <template v-if="activeChat">
              <Messages v-if="messages" :_messages="messages" :withUser="activeUser" />
              <AddMessage :withUser="activeUser"/>
            </template>
          </div>
        </div>
      </template>
    </template>
    <NoConversations v-if="noMessages"/>
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
      deleteInProgress: false
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
      return this.$store.state.chat.chats.map(v => {
        const copy = { ...v };
        if (Object.keys(copy.lastMessage).length === 0) {
          copy.lastMessage = null;
        }
        if (this.activeUserId === copy.withUser.id) {
          copy.active = true;
        }
        return copy;
      });
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
    }
  },

  watch: {
    activeUserId(activeUserId) {
      this.$store.commit("chat/messages", []);
      if (!activeUserId) {
        if (!this.isHome) {
          // this.goTo("/chat");
        }
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
    }
  },

  created() {
    this.$store.dispatch("chat/fetchChats").then(() => {
      if (this.isHome) {
        //
      } else if (this.isNew) {
        //
      } else if (this.activeUserId) {
        this.$store.commit("chat/setActiveUserId", this.activeUserId);
        this.fetchMessages();
      }
    });
  },

  beforeDestroy() {
    this.$store.commit("chat/messages", []);
  }
};
</script>
