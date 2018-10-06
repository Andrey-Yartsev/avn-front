<template>
  <ChatWrapper>
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
          to="/"><span>Home1</span></router-link>
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
                  <div class="chatView active">
                    <div class="avatar"></div>
                    <div class="chatViewContent">
                      <div class="chatView__header">
                        <span class="name">Tester</span>
                        <span class="user-login"><span class="username">tester</span></span>
                        <div class="time">56 minutes</div>
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
          <a class="name"></a>
          <span class="user-login"><a class="username"></a></span>
          <span class="chatOptions"></span>
          <span class="isTyping">is typing...</span>
        </div>
      </div>
      <div class="chatCollectionContentWrapper">
        <div class="chatMessagesCollectionView">
        </div>
      </div>
    </template>
    <div
      slot="extra"
      class="msg-no-chat visible"
      v-if="noMessages"
    >
      <div class="msg-no-chat__msg">You have no active conversations</div>
      <router-link
        tag="div"
        to="/chat/new"
        class="btn-start newMessageEvent"
      >New message</router-link>
    </div>
  </ChatWrapper>
</template>

<script>
import userMixin from "@/mixins/user";
import ChatWrapper from "./ChatWrapper";

export default {
  name: "Chat",

  mixins: [userMixin],

  components: {
    ChatWrapper
  },

  computed: {
    noMessages() {
      return this.$route.path === "/chat/no-messages";
    }
  },

  created() {
    this.$store.dispatch("chat/fetchChats");
  }
};
</script>
