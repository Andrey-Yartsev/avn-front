<template>
  <ChatWrapper>
    <template slot="col1">
      <div class="chatHeader">
        <div class="contactsListHeader main-header">
          <div class="back-popup-btn">
            <span
              class="back backEvent hidden-mobile icn-item"
              @click="backDesktop"
            ></span>
            <a
              href="/chat"
              @click.prevent="goTo('/chat')"
              class="header-return-btn go-back go-back_times hidden-desktop"
              v-if="$mq === 'mobile'"
            >
              <span class="category-name">New message</span>
            </a>
          </div>
          <h3 class="hidden-mobile new-message-title">New message</h3>
          <button
            class="nextStep btn sm hidden-desktop"
            :disabled="!selected.length"
            @click="next"
            v-if="$mq === 'mobile'"
          >
            Next
          </button>
        </div>
      </div>
      <div
        class="chatCollectionContentWrapper"
        :class="{ 'contacts-top': contactsScrollTop }"
      >
        <div
          class="searchContact"
          :class="{ 'user-selected': !!selected.length }"
          v-if="selectedChats.length"
        >
          <component :is="scrollableComponent" class="all-contacts-found">
            <div class="selectedContacts">
              <div
                class="chatSelectedView"
                v-for="v in selectedChats"
                v-bind:key="v.withUser.id"
              >
                <span class="chatSelectedName">{{ v.withUser.name }}</span>
                <span
                  class="remove icn-item btn-reset btn-reset_fix-sizes btn-reset_ml icn-pos_center"
                  @click="toggleSelect(v.withUser.id)"
                ></span>
              </div>
            </div>
          </component>
        </div>
        <div
          class="searchWrapper"
          :class="{
            'no-results': !chats.length && searchQuery.length,
            'search-text': chats.length && searchQuery.length
          }"
        >
          <span class="sendTo">To</span>
          <input
            @keyup="search"
            v-model="searchQuery"
            type="text"
            class="searchInput"
            placeholder="Search"
          />
          <span
            class="btn-clear-search btn-clear-search_lg icn-item btn-reset btn-reset_prim-color icn-pos_center"
            @click="reset"
            v-if="searchQuery.length"
          ></span>
          <div
            class="btn-selected-all icn-item"
            @click="toggleSelectAll"
            v-if="chats.length"
            :class="{ visible: chats.length, active: isAllSelected }"
          ></div>
        </div>
        <perfect-scrollbar
          class="searchChatContacts"
          @ps-scroll-y="contactsScrollChange"
          ref="contacts"
        >
          <div class="searchResult" v-if="chats.length">
            <div
              v-for="v in chats"
              v-bind:key="v.withUser.id"
              class="searchChatContactsView"
              @click="toggleSelect(v.withUser.id)"
              :class="{ active: isSelected(v.withUser.id) }"
            >
              <span class="avatar avatar_gap-r-sm avatar_sm">
                <span class="avatar__img">
                  <img v-if="v.withUser.avatar" :src="v.withUser.avatar" />
                </span>
              </span>
              <div class="username-group">
                <div class="chatView__header">
                  <span class="name">{{ v.withUser.name }}</span>
                  <span
                    class="verified-user icn-item"
                    v-if="v.withUser.isVerified"
                  ></span>
                </div>
                <div class="user-login reset-ml">
                  <span class="username">{{ v.withUser.username }}</span>
                </div>
              </div>
              <span class="check icn-item"></span>
            </div>
          </div>

          <div
            class="no-results-search"
            :class="{ show: !chats.length }"
            v-if="!foundUsers || !foundUsers.length"
          >
            <div class="no-results-search__message">
              <span class="no-results-search__text">
                Nothing found for&nbsp;
              </span>
              <span class="searchAllTag">"{{ searchQuery }}"</span>
            </div>
          </div>
        </perfect-scrollbar>
      </div>
    </template>
    <template slot="col2">
      <div class="chatHeader chatHeader_add-shadow no-nav">
        <div class="selectedChatHeader">
          <div class="back-popup-btn hidden-desktop" v-if="$mq === 'mobile'">
            <span class="back backEvent icn-item" @click="back"></span>
          </div>
          <template v-if="selectedUser">
            <router-link
              class="avatar avatar_gap-r-md avatar_sm hidden-mobile"
              :to="'/' + selectedUser.username"
              ><span class="avatar__img"></span
            ></router-link>
            <div class="username-group">
              <router-link class="name" :to="'/' + selectedUser.username">{{
                selectedUser.name
              }}</router-link>
              <span
                class="verified-user icn-item"
                v-if="selectedUser.isVerified"
              ></span>
              <span class="user-login">
                <router-link
                  class="username"
                  :to="'/' + selectedUser.username"
                  >{{ selectedUser.username }}</router-link
                ></span
              >
            </div>
          </template>
          <span v-else-if="selected.length" class="mass-message"
            >Mass message</span
          >
          <div
            class="more-functions"
            v-if="selectedUser"
            :class="{ open: chatOptionsOpened }"
            @click="chatOptionsOpened = !chatOptionsOpened"
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
            <div class="more-functions__btn"></div>
            <div class="more-functions__dropdown">
              <div class="more-functions__dropdown-inside">
                <ul class="more-functions__list">
                  <li class="more-functions__item">
                    <router-link
                      class="profile-url more-functions__link"
                      :to="'/' + selectedUser.username"
                      ><span class="more-functions__option"
                        >View profile</span
                      ></router-link
                    >
                  </li>
                  <li class="more-functions__item">
                    <a class="menu-cancel more-functions__link"
                      ><span class="more-functions__option">Cancel</span></a
                    >
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="chatCollectionContentWrapper">
        <div
          class="chatMessagesCollectionView"
          :class="{ 'no-selected-conversation': !selected.length }"
        >
          <div
            class="chat-section loader-container loader-container_center"
            v-if="sending"
          >
            <Loader
              :fullscreen="false"
              text="Sending..."
              class="small overlay_fulllight"
            />
          </div>
          <div class="chat-section" v-else>
            <div class="chatContent chatContent_new-chat">
              <div
                class="selectedContacts selectedContacts_recipients"
                v-if="selectedUsers && selectedUsers.length"
              >
                <b class="selectedContacts__title">Recipients:</b>
                <span
                  v-for="v in selectedUsers"
                  :key="v.id"
                  class="selectedContacts__item"
                >
                  <a
                    :href="'/' + v.username"
                    target="_blank"
                    class="chatSelectedView chatSelectedView_link"
                    ><span class="chatSelectedName">{{ cut(v.name) }}</span></a
                  >
                </span>
              </div>
            </div>
            <div class="msg-no-chat">
              <div class="msg-no-chat__msg">
                Select people to send them a message
              </div>
              <div class="btn border md alt btn-start" @click="toggleSelectAll">
                Select all
              </div>
            </div>
          </div>
          <ChatAddMultiMessage
            :userIds="selected"
            :disable="sending"
            @startSending="startSending"
            @sent="sent"
          />
        </div>
      </div>
    </template>
  </ChatWrapper>
</template>

<script>
import User from "@/mixins/user";
import ChatWrapper from "./Wrapper";
import ChatAddMultiMessage from "./AddMultiMessage";
import ClickOutside from "vue-click-outside";
import ModalRouterGoto from "@/mixins/modalRouter/goto";
import Loader from "@/components/common/Loader";

export default {
  name: "Chat",

  mixins: [User, ModalRouterGoto],

  directives: {
    ClickOutside
  },

  components: {
    ChatAddMultiMessage,
    ChatWrapper,
    Loader
  },

  data() {
    return {
      selected: [],
      searchQuery: "",
      chatOptionsOpened: false,
      contactsScrollTop: true,
      sending: false
    };
  },

  computed: {
    scrollableComponent() {
      return this.$mq === "mobile" ? "div" : "perfect-scrollbar";
    },
    noMessages() {
      return false;
      // return this.$route.params[1] && this.$route.params[1] === "no-messages";
    },
    chats() {
      let chats = this.$store.state.chat.anyChats.map(v => {
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
    },
    selectedUsers() {
      return this.selectedChats.map(v => v.withUser);
    }
  },

  methods: {
    cut(v) {
      if (!v) {
        return "…";
      }
      if (v.length <= 30) {
        return v;
      }
      return v.substring(0, 30) + "…";
    },
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
      if (this.selected.length !== this.chats.length) {
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
      this.$store.commit("chat/setSecondScreen", false);
    },
    backDesktop() {
      this.goTo("/chat");
    },
    gotoLastSelected() {
      this.goTo("/chat/" + this.selected[this.selected.length - 1]);
      this.selected = [];
    },
    next() {
      this.$store.commit("chat/setSecondScreen", true);
    },
    contactsScrollChange() {
      if (this.$refs.contacts.$el.scrollTop) {
        if (this.contactsScrollTop) {
          this.contactsScrollTop = false;
        }
      } else {
        if (!this.contactsScrollTop) {
          this.contactsScrollTop = true;
        }
      }
    },
    addNewStory() {
      document.getElementById("storyFileSelect").click();
    },
    goToStream() {
      window.location = "/stream";
    },
    startSending() {
      this.sending = true;
    },
    sent() {
      this.sending = false;
      this.goTo("/chat");
    },
    reset() {
      this.searchQuery = "";
      this.$store.commit("chat/resetSearchUsers");
    }
  },

  created() {
    this.$store.dispatch("chat/fetchAnyChats");
    this.$store.dispatch("chat/fetchChats");
    this.search();
  },

  beforeDestroy() {
    this.$store.commit("chat/setSecondScreen", false);
  }
};
</script>
