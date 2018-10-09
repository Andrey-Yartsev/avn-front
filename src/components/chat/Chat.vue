<template>
  <Wrapper>
    <template slot="col1">
      <div class="chatHeader chatHeader_add-shadow">
        <div class="contactsListHeader">
          <router-link :to="'/' + user.name" class="avatar header-avatar">
            <img
              :src="user.avatar">
          </router-link>
          <h3>Messages</h3>
          <div class="newMessage-link">
            <router-link
              tag="span"
              to="/chat/new"
              class="newMessage newMessageEvent hidden-mobile"
            >New message</router-link>
            <router-link
              to="/chat/new"
              class="newMessage hidden-desktop"
            >New message</router-link>
          </div>
        </div>
      </div>
      <nav class="header-nav hidden-desktop">
        <router-link
          class="menu-item-home homePage asd"
          active-class="dummy"
          exact-active-class="active"
          to="/"><span>Home</span></router-link>
        <router-link
          class="menu-item-explore"
          exact-active-class="active"
          to="/explore"><span>Explore</span></router-link>
        <router-link
          class="menu-item-notifications hidden-mobile btn-notifications unread"
          exact-active-class="active"
          to="/notifications"><span>Notifications</span></router-link>
        <router-link
          class="menu-item-notifications hidden-desktop unread"
          exact-active-class="active"
          to="/notifications"><span>Notifications</span></router-link>
        <router-link
          class="menu-item-messages showChat hidden-mobile"
          exact-active-class="active"
          to="/chat"><span>Messages</span></router-link>
        <router-link
          class="menu-item-messages hidden-desktop"
          active-class="active"
          to="/chat"><span>Messages</span></router-link>
      </nav>
      <div
        class="chatCollectionContentWrapper chatCollectionContentWrapper_mob-height"
        v-if="!noMessages"
      >
        <div class="contactsList">
          <div
            class="contactsListContent os-host os-theme-dark os-host-resize-disabled os-host-scrollbar-horizontal-hidden os-host-scrollbar-vertical-hidden os-host-transition">
            <div class="os-resize-observer-host">
              <div class="os-resize-observer observed" style="left: 0px; right: auto;"></div>
            </div>
            <div class="os-size-auto-observer" style="height: calc(100% + 1px); float: left;">
              <div class="os-resize-observer observed"></div>
            </div>
            <div class="os-content-glue" style="width: 379px; margin: 0px; height: 792px;"></div>
            <div class="os-padding">
              <div class="os-viewport os-viewport-native-scrollbars-invisible" style="">
                <div class="os-content" style="padding: 0px; height: 100%; width: 100%;">
                  <div
                    @click="openChat(v.withUser.id)"
                    class="chatView"
                    v-for="v in chats" v-bind:key="v.withUser.id" :class="{active: v.active}"
                  >
                    <div class="avatar"></div>
                    <div class="chatViewContent">
                      <div class="chatView__header">
                        <span class="name">{{ v.withUser.name }}</span>
                        <span class="user-login"><span class="username">{{ v.withUser.username }}</span></span>
                        <div class="time" v-if="v.lastMessage">{{ messageTime(v.lastMessage) }}</div>
                      </div>
                      <div class="chatView__body">
                        <p class="typing">
                          <span class="message">ererferf</span>
                          <span class="isTyping">tester is typing...</span>
                        </p>
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
                <div class="os-scrollbar-handle" style="height: 100%; transform: translate(0px, 0%);"></div>
              </div>
            </div>
            <div class="os-scrollbar-corner"></div>
          </div>
        </div>
      </div>
    </template>
    <template slot="col2">
      <div class="chatHeader chatHeader_add-shadow no-nav" v-if="activeChat">
        <div class="selectedChatHeader">
          <span class="back hidden-desktop"></span>
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

          <span class="chatOptions" :class="{open: chatOptionsOpened}">
            <span class="chatExpand" @click="chatOptionsOpened = !chatOptionsOpened"></span>
              <div class="chatOptions__dropdown">
                <ul class="chatOptions__list">
                  <li><router-link class="profile-url" :to="'/' + activeUser.name">View profile</router-link></li>
                  <li v-if="activeUser.isBlocked"><a class="menu-block" @click="unblockActiveUser">Unblock user</a></li>
                  <li v-else><a class="menu-block" @click="blockActiveUser">Block user</a></li>
                  <li v-if="deleteInProgress"><a>Deleting...</a></li>
                  <li v-else><a class="menu-delete" @click="deleteConversation">Delete conversation</a></li>
                  <li><a class="menu-report" @click="report">Report</a></li>
                  <li><a class="menu-cancel" @click="chatOptionsOpened = false">Cancel</a></li>
                </ul>
              </div>
            </span>
        </div>
      </div>
      <div class="chatCollectionContentWrapper">
        <div class="chatMessagesCollectionView">
          <div class="chat-section" v-if="messagesLoading">
            <Loader :fullscreen="false" text="" class="transparent small"/>
          </div>
          <Messages v-else-if="messages" :_messages="messages"/>
          <AddMessage :withUser="{id: activeUserId}"/>
        </div>
      </div>
    </template>
    <NoConversations v-if="noMessages"/>
  </Wrapper>
</template>

<script>
import dateFns from "date-fns";
import userMixin from "@/mixins/user";
import Wrapper from "./Wrapper";
import Messages from "./Messages";
import AddMessage from "./AddMessage";
import NoConversations from "./NoConversations";
import Loader from "@/components/common/Loader";

export default {
  name: "Chat",

  mixins: [userMixin],

  components: {
    Wrapper,
    Messages,
    AddMessage,
    NoConversations,
    Loader
  },

  data() {
    return {
      chatOptionsOpened: false,
      isTyping: false,
      deleteInProgress: false
    };
  },

  computed: {
    noMessages() {
      return this.$route.path === "/chat/no-messages";
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
      return parseInt(this.$route.params.userId);
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
        this.$router.push("/chat/new");
        return;
      }
      this.fetchMessages();
    }
  },

  methods: {
    openChat(id) {
      this.$router.push("/chat/" + id);
    },
    messageTime(message) {
      return dateFns.distanceInWordsStrict(new Date(), message.changedAt);
    },
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
        this.$router.push("/chat");
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
    }
  },

  created() {
    this.$store.dispatch("chat/fetchChats").then(() => {
      if (!this.hasActiveChats) {
        this.$router.push("/chat/new");
      } else if (!this.activeUserId) {
        this.$router.push("/chat/" + this.firstActiveChat.withUser.id);
      } else {
        this.fetchMessages();
      }
    });
  }
};
</script>
