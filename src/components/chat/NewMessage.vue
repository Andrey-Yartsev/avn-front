<template>
  <ChatWrapper>
    <template slot="col1">
      <div class="chatHeader chatHeader_add-shadow">
        <div class="contactsListHeader">
          <div
            class="add-new-type add-new-type_underline-items add-new-type_b-with-text line-bottom chat-new-type hidden-mobile">
            <div class="addNewNav"><span class="new-post"><span class="add-new-type__text">Post</span></span>
              <span class="new-story"><span class="add-new-type__text">Story</span></span>
              <span class="new-live"><span class="add-new-type__text">Go live</span></span>
              <span class="new-message active"><span class="add-new-type__text">Message</span></span>
              <input type="file" class="hidden storyFileSelect"
                     accept=".jpg,.jpeg,.png,.mp4,.mov,.moov,.m4v,.mpg,.mpeg,.wmv,.avi"></div>
          </div>
          <div class="back-popup-btn">
            <span class="back backEvent hidden-mobile" @click="back"></span>
            <a href="/chat" class="back hidden-desktop">
              <span class="hidden-desktop">New message</span>
            </a>
          </div>
          <button class="nextStep btn hidden-desktop" disabled="">Next</button>
        </div>
      </div>
      <div class="add-new-type add-new-type_underline-items line-bottom add-new-type_b-with-text hidden-desktop">
        <div class="addNewNav"><span class="new-post"><span class="add-new-type__text">Post</span></span>
          <span class="new-story"><span class="add-new-type__text">Story</span></span>
          <span class="new-live"><span class="add-new-type__text">Go live</span></span>
          <span class="new-message active"><span class="add-new-type__text">Message</span></span>
          <input type="file" class="hidden storyFileSelect"
                 accept=".jpg,.jpeg,.png,.mp4,.mov,.moov,.m4v,.mpg,.mpeg,.wmv,.avi"></div>
      </div>
      <div class="chatCollectionContentWrapper">
        <div
          class="searchChatContacts os-host os-theme-dark os-host-resize-disabled os-host-scrollbar-horizontal-hidden os-host-scrollbar-vertical-hidden os-host-transition">
          <div class="os-resize-observer-host">
            <div class="os-resize-observer observed" style="left: 0px; right: auto;"></div>
          </div>
          <div class="os-size-auto-observer" style="height: calc(100% + 1px); float: left;">
            <div class="os-resize-observer observed"></div>
          </div>
          <div class="os-content-glue" style="margin: -15px -13px; width: 735px; height: 165px;"></div>
          <div class="os-padding">
            <div class="os-viewport os-viewport-native-scrollbars-invisible" style="">
              <div class="os-content" style="padding: 15px 13px; height: auto; width: 100%;">
                <div class="searchContact">
                  <div class="all-contacts-found">
                    <div class="selectedContacts" v-if="selected.length">
                      <div class="chatSelectedView" v-for="v in selectedChats" v-bind:key="v.withUser.id">
                        <span class="chatSelectedName">{{ v.withUser.name }}</span>
                        <span class="remove" @click="toggleSelect(v.withUser.id)"></span>
                      </div>
                    </div>
                    <div
                      class="btn-selected-all visible"
                      @click="toggleSelectAll"
                      :class="{active: isAllSelected}"
                    ></div>
                  </div>
                  <div class="searchWrapper">
                    <span class="sendTo">To</span>
                    <input
                      @keyup="search"
                      v-model="searchQuery"
                      type="text" class="searchInput" placeholder="Search">
                  </div>
                </div>
                <div class="searchResult">
                  <div
                    v-for="v in chats" v-bind:key="v.withUser.id"
                    class="searchChatContactsView"
                    @click="toggleSelect(v.withUser.id)"
                    :class="{active: isSelected(v.withUser.id)}"
                  >
                    <span class="avatar">
                      <img v-if="v.withUser.avatar" :src="v.withUser.avatar"/>
                    </span>
                    <div class="chatView__header">
                      <span class="name">{{ v.withUser.name }}</span>
                    </div>
                    <div class="user-login">
                      <span class="username">{{ v.withUser.username }}</span>
                    </div>
                    <span class="check"></span>
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

    </template>
    <template slot="col2">
      <div class="chatHeader chatHeader_add-shadow no-nav">


        <div class="selectedChatHeader">
          <div class="back-popup-btn hidden-desktop">
            <span class="back backEvent" @click="back"></span>
          </div>

          <template v-if="selectedUser">
            <router-link class="avatar" :to="'/' + selectedUser.username"></router-link>
            <router-link class="name" :to="'/' + selectedUser.name">{{ selectedUser.name }}</router-link>
            <span class="user-login">
              <router-link class="username" :to="'/' + selectedUser.name">{{ selectedUser.name }}</router-link></span>
          </template>

          <span v-else-if="selected.length" class="mass-message">Mass message</span>

          <span
            class="chatOptions"
            v-if="selectedUser"
            :class="{open: chatOptionsOpened}"
            @click="chatOptionsOpened = !chatOptionsOpened"
          >
            <span class="chatExpand"></span>
              <div class="chatOptions__dropdown">
                <ul class="chatOptions__list">
                  <li><router-link class="profile-url" :to="'/' + selectedUser.username">View profile</router-link></li>
                  <li><a class="menu-cancel" @click="chatOptionsOpened = false">Cancel</a></li>
                </ul>
              </div>
            </span>
        </div>
      </div>
      <div class="chatCollectionContentWrapper">
        <div class="chatMessagesCollectionView" :class="{'no-selected-conversation': !selected.length}">

          <div class="chat-section">
            <div class="chatContent"></div>
            <div class="msg-no-chat">
              <div class="msg-no-chat__msg">Select people from your contacts</div>
              <div class="btn-start btn-selected-all" @click="toggleSelectAll">Select all</div>
            </div>
          </div>
          <ChatAddMessage />

        </div>
      </div>
    </template>
  </ChatWrapper>
</template>

<script>
import userMixin from "@/mixins/user";
import ChatWrapper from "./Wrapper";
import ChatAddMessage from "./AddMessage";

export default {
  name: "Chat",

  mixins: [userMixin],

  components: {
    ChatAddMessage,
    ChatWrapper
  },

  data() {
    return {
      selected: [],
      searchQuery: "",
      chatOptionsOpened: false
    };
  },

  computed: {
    noMessages() {
      return this.$route.params[1] && this.$route.params[1] === "no-messages";
    },
    chats() {
      let chats = this.$store.state.chat.chats.map(v => {
        v.selected = this.selected.indexOf(v.withUser.id) !== -1;
        return v;
      });
      if (this.foundUsers) {
        const foundUserIds = this.foundUsers.map(v => v.id);
        chats = chats.filter(v => foundUserIds.indexOf(v.withUser.id) !== -1);
      }
      return chats;
    },
    selectedChats() {
      return this.chats.filter(v => v.selected);
    },
    isAllSelected() {
      return this.chats.length === this.selected.length;
    },
    foundUsers() {
      return this.$store.state.chat.chatUsers;
    },
    selectedUser() {
      if (this.selected.length !== 1) {
        return null;
      }
      const chat = this.chats.find(v => v.withUser.id === this.selected[0]);
      return chat.withUser;
    }
  },

  methods: {
    toggleSelect(id) {
      if (this.selected.indexOf(id) !== -1) {
        this.selected = this.selected.filter(_id => _id !== id);
      } else {
        this.selected.push(id);
      }
    },
    isSelected(id) {
      return this.selected.indexOf(id) !== -1;
    },
    toggleSelectAll() {
      if (!this.selected.length) {
        this.selected = this.chats.map(v => v.withUser.id);
      } else {
        this.selected = [];
      }
    },
    search() {
      if (!this.searchQuery) {
        this.$store.commit("chat/resetSearchUsers");
        return;
      }
      if (this.searchId) {
        clearTimeout(this.searchId);
      }
      this.searchId = setTimeout(() => {
        this.$store.dispatch("chat/searchUsers", this.searchQuery);
      }, 300);
    },
    back() {
      this.$router.push("/chat");
    }
  },

  created() {
    this.$store.dispatch("chat/fetchChats");
    this.search();
  }
};
</script>
