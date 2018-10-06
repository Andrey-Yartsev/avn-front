<template>
  <div class="chatCollectionView">
    <div class="chatCollectionContent">
      <div class="chatCollectionContent__col chatCollectionContent__col_narrow">
        <div class="chat-container">

          <!--
          <div class="chatHeader chatHeader_add-shadow">
            <div class="contactsListHeader">
              <router-link :to="'/' + user.name" class="avatar header-avatar">
                <img
                  :src="user.avatar">
              </router-link>
              <h3>Messages</h3>
              <div class="newMessage-link">
                <span class="newMessage newMessageEvent hidden-mobile">New message</span>
                <router-view to="/chat/new" class="newMessage hidden-desktop">New message</router-view>
              </div>
            </div>
          </div>
          -->

          <div class="contactsListHeader">
            <div class="add-new-type add-new-type_underline-items add-new-type_b-with-text line-bottom chat-new-type hidden-mobile"><div class="addNewNav"><span class="new-post"><span class="add-new-type__text">Post</span></span>
              <span class="new-story"><span class="add-new-type__text">Story</span></span>
              <span class="new-live"><span class="add-new-type__text">Go live</span></span>
              <span class="new-message active"><span class="add-new-type__text">Message</span></span>
              <input type="file" class="hidden storyFileSelect" accept=".jpg,.jpeg,.png,.mp4,.mov,.moov,.m4v,.mpg,.mpeg,.wmv,.avi"></div></div>
            <div class="back-popup-btn">
              <span class="back backEvent hidden-mobile"></span>
              <a href="/chat" class="back hidden-desktop">
                <span class="hidden-desktop">New message</span>
              </a>
            </div>
            <button class="nextStep btn hidden-desktop" disabled="">Next</button>
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
          <div class="chatCollectionContentWrapper chatCollectionContentWrapper_mob-height" v-if="hasMessages">
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
        </div>
      </div>
      <div class="chatCollectionContent__col chatCollectionContent__col_wide">
        <div class="chatHeader chatHeader_add-shadow no-nav">
          <div class="selectedChatHeader">
            <span class="back hidden-desktop"></span>
            <a class="name"></a>
            <span class="user-login"><a class="username"></a></span>
            <span class="chatOptions">
                </span>
            <span class="isTyping">is typing...</span>
          </div>
        </div>
        <div class="chatCollectionContentWrapper">
          <div class="chatMessagesCollectionView">
          </div>
        </div>
      </div>
      <div class="msg-no-chat visible" v-if="!hasMessages">
        <div class="msg-no-chat__msg">You have no active conversations</div>
        <div class="btn-start newMessageEvent">New message</div>
      </div>
    </div>
  </div>
</template>

<script>
import userMixin from "@/mixins/user";

export default {
  name: "Chat",

  mixins: [userMixin],

  computed: {
    hasMessages() {
      return true;
    }
  },

  created() {
    this.$store.dispatch("chat/fetchChats");
  }
};
</script>
