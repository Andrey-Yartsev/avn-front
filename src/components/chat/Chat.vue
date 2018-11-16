<template>
  <Wrapper>
    <template slot="col1">
      <div class="chatHeader chatHeader_add-shadow">
        <div class="contactsListHeader">
          <router-link :to="'/' + user.name" class="avatar header-avatar">
            <img v-if="user.avatar" :src="user.avatar">
          </router-link>
          <h3>Messages</h3>
          <div class="newMessage-link">
            <router-link
              tag="span"
              to="/chat/new"
              class="newMessage newMessageEvent hidden-mobile"
            >New message
            </router-link>
            <router-link
              to="/chat/new"
              class="newMessage hidden-desktop"
            >New message
            </router-link>
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
      <div v-if="isHome" class="home-message">
        Select user for conversation
      </div>
      <template v-else>
        <div class="chatHeader chatHeader_add-shadow no-nav" v-if="activeChat">
          <div class="selectedChatHeader">
            <span class="back hidden-desktop" @click="mobileBack"></span>
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
                  <li v-if="deleteInProgress"><a>Deleting...</a></li>
                  <li v-else><a class="menu-delete" @click="deleteConversation">Delete conversation</a></li>
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
            <div class="chat-section" v-if="messagesLoading">
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
import ModalRouter from "@/mixins/modalRouter";

export default {
  name: "Chat",

  mixins: [User, ModalRouter],

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
    ContactList
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
      return this.routeName === "ChatHome";
    },
    noMessages() {
      return this.routePath === "/chat/no-messages";
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
          this.goTo("/chat/new");
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
      this.goTo("/chat/home");
    }
  },

  created() {
    this.$store.dispatch("chat/fetchChats").then(() => {
      if (this.isHome) {
        // nothing
      } else if (!this.hasActiveChats) {
        this.goTo("/chat/new");
      } else if (!this.activeUserId) {
        this.goTo("/chat/" + this.firstActiveChat.withUser.id);
      } else {
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

<style>
.contactsListContent .scrolly-bar {
  border-width: 3px;
  width: 10px;
}
.home-message {
  padding: 20px;
  text-align: center;
}
</style>
