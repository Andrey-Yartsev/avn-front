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

                  <div class="chatView" v-for="v in chats" v-bind:key="v.withUser.id" :class="{active: v.active}">
                    <div class="avatar"></div>
                    <div class="chatViewContent">
                      <div class="chatView__header">
                        <span class="name">{{ v.withUser.name }}</span>
                        <span class="user-login"><span class="username">{{ v.withUser.username }}</span></span>
                        <div class="time">{{ messageTime(v.lastMessage) }}</div>
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
      <div class="chatHeader chatHeader_add-shadow no-nav">
        <div class="selectedChatHeader">
          <span class="back hidden-desktop"></span>
          <router-link :to="'/' + activeUser.name" class="avatar">
            <img :src="activeUser.avatar" v-if="activeUser.avatar"/>
          </router-link>
          <router-link :to="'/' + activeUser.name" class="name">
            {{ activeUser.name }}
          </router-link>
          <span class="user-verified-user" v-if="activeUser.isVerified"></span>
        </div>
      </div>
      <div class="chatCollectionContentWrapper">
        <div class="chatMessagesCollectionView">
          <Messages v-if="messages" :_messages="messages"/>
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

export default {
  name: "Chat",

  mixins: [userMixin],

  components: {
    Wrapper,
    Messages,
    AddMessage,
    NoConversations
  },

  data() {
    return {
      chatOptionsOpened: false,
      isTyping: false
    };
  },

  computed: {
    noMessages() {
      return this.$route.path === "/chat/no-messages";
    },
    chats() {
      return this.$store.state.chat.chats.map(v => {
        if (this.activeUserId === v.withUser.id) {
          v.active = true;
        }
        return v;
      });
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
    }
  },

  methods: {
    messageTime(message) {
      return dateFns.distanceInWordsStrict(new Date(), message.changedAt);
    }
    // reportUser() {
    //   this.$store.dispatch("modal/show", {
    //     name: "postReport",
    //     data: {
    //       postId: this.postId
    //     }
    //   });
    // }
  },

  created() {
    this.$store.dispatch("chat/fetchChats").then(() => {
      if (!this.activeUserId) {
        this.$router.push("/chat/" + this.chats[0].withUser.id);
      } else {
        this.$store.dispatch("chat/fetchMessages", this.activeUserId);
      }
    });
  }
};
</script>
