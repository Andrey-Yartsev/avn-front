<template>
  <ChatWrapper>
    <template slot="col1">
      <div class="chatHeader" :class="{ 'no-nav': $mq === 'mobile' }">
        <div class="contactsListHeader">
          <div class="back-popup-btn">
            <span
              class="back backEvent hidden-mobile icn-item"
              v-if="$mq === 'desktop'"
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
          <h3 class="hidden-mobile chat-title" v-if="$mq === 'desktop'">
            New message
          </h3>
          <button
            class="nextStep btn sm hidden-desktop"
            :disabled="!hasSelectedUsers"
            @click="next"
            v-if="$mq === 'mobile'"
          >
            Next
          </button>
        </div>
      </div>
      <div
        class="chatCollectionContentWrapper bulk-message"
        :class="{ 'contacts-top': contactsScrollTop }"
      >
        <!--
        <div
          class="searchContact"
          :class="{ 'user-selected': !!selected.length }"
          v-if="hasSelectedUsers && !selectAll"
        >
          <component :is="scrollableComponent" class="all-contacts-found">
            <div class="selectedContacts">
              <div
                class="chatSelectedView"
                v-for="v in selectedUsers"
                v-bind:key="v.id"
                @click="toggleSelect(v.id)"
              >
                <span class="chatSelectedName">1{{ v.name }}</span>
                <span
                  class="remove icn-item btn-reset btn-reset_fix-sizes btn-reset_ml icn-pos_center"
                ></span>
              </div>
            </div>
          </component>
        </div>
        -->
        <div
          class="searchWrapper"
          :class="{
            'no-results': !chats.length && searchQuery.length,
            'no-found-users': !foundUsers.length,
            'search-text': chats.length && searchQuery.length,
            'select-all': selectAll
          }"
        >
          <span class="sendTo"
            >To{{ selectAll ? ` All contacts${allUsersCountText}` : "" }}</span
          >
          <input
            v-if="!selectAll"
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
          <div class="select-all-block">
            <div
              class="btn-selected-all icn-item"
              @click="toggleSelectAll"
              v-if="foundUsers.length"
              :class="{ visible: foundUsers.length, active: selectAll }"
            >
              <span>Select All Contacts</span>
            </div>
            <div
              class="checkbox-block"
              v-if="selectAll"
              :class="{ enabled: excludeStars }"
            >
              <span class="caption">Exclude all AVN Stars</span>
              <label class="toggle-element" for="exclude_stars">
                <input
                  class="tweetSend"
                  type="checkbox"
                  id="exclude_stars"
                  v-model="excludeStars"
                />
                <span class="toggle-element_switcher"></span>
              </label>
            </div>
            <div
              class="checkbox-block"
              v-if="selectAll"
              :class="{ enabled: excludeSubscribers }"
            >
              <span class="caption">Exclude all subscribers</span>
              <label class="toggle-element" for="exclude_subscribers">
                <input
                  class="tweetSend"
                  type="checkbox"
                  id="exclude_subscribers"
                  v-model="excludeSubscribers"
                />
                <span class="toggle-element_switcher"></span>
              </label>
            </div>
          </div>
        </div>
        <div class="chatFlatLoader semi-transparent" v-if="usersSearching" />
        <perfect-scrollbar
          class="searchChatContacts"
          @ps-scroll-y="contactsScrollChange"
          ref="contacts"
        >
          <!-- <div class="searchResult" v-if="!selectAll && foundUsers.length"> -->
          <div class="searchResult" v-if="foundUsers.length">
            <div
              v-for="v in foundUsers"
              v-bind:key="v.id"
              class="searchChatContactsView"
              @click="selectAll ? toggleDeselect(v.id) : toggleSelect(v.id)"
              :class="{
                active: isSelected(v.id) || (selectAll && !isDeselected(v.id))
              }"
            >
              <span
                class="avatar avatar_gap-r-sm avatar_sm"
                :class="{ 'online-state': isOnline(v.id) }"
              >
                <span class="avatar__img">
                  <img v-if="v.avatar" :src="v.avatar" />
                </span>
              </span>
              <div class="username-group">
                <div class="chatView__header">
                  <span class="name">{{ v.name }}</span>
                  <span
                    class="verified-user icn-item"
                    :class="{
                      fullyMonetized: v.canEarn && v.canPayoutsRequest
                    }"
                    v-if="v.isVerified || (v.canEarn && v.canPayoutsRequest)"
                  ></span>
                </div>
                <div class="user-login reset-ml">
                  <span class="username">{{ v.username }}</span>
                </div>
              </div>
              <span class="check icn-item"></span>
            </div>
            <div
              class="scrollObserver"
              v-if="foundUsers.length"
              ref="scrollObserver"
            ></div>
          </div>
          <div
            class="chatFlatLoader past-messages semi-transparent"
            v-if="foundUsers.length && !allDataRecieved"
          >
            Loading history...
          </div>

          <div
            class="no-results-search"
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
      <div
        class="chatHeader chatHeader_add-shadow"
        :class="{ 'no-nav': $mq === 'mobile' }"
      >
        <div class="selectedChatHeader">
          <div class="back-popup-btn hidden-desktop" v-if="$mq === 'mobile'">
            <span class="back backEvent icn-item" @click="back"></span>
          </div>
          <template v-if="selectedUser">
            <router-link
              class="avatar avatar_gap-r-md avatar_sm hidden-mobile"
              :to="'/' + selectedUser.username"
              :class="{ 'online-state': isOnline(selectedUser.id) }"
              ><span class="avatar__img">
                <img
                  v-if="selectedUser.avatar"
                  :src="selectedUser.avatar"
                /> </span
            ></router-link>
            <div class="username-group">
              <router-link class="name" :to="'/' + selectedUser.username">{{
                selectedUser.name
              }}</router-link>
              <span
                class="verified-user icn-item"
                :class="{
                  fullyMonetized:
                    selectedUser.canEarn && selectedUser.canPayoutsRequest
                }"
                v-if="
                  selectedUser.isVerified ||
                    (selectedUser.canEarn && selectedUser.canPayoutsRequest)
                "
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
          <span v-else-if="hasSelectedUsers" class="mass-message"
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
          :class="{ 'no-selected-conversation': !hasSelectedUsers }"
        >
          <div
            class="chat-section loader-container loader-container_center"
            v-if="sending"
          >
            <Loader
              :fullscreen="false"
              text="Sending..."
              :fulllight="true"
              :small="true"
            />
          </div>
          <div class="chat-section" v-else>
            <div class="chatContent chatContent_new-chat">
              <div
                class="selectedContacts selectedContacts_recipients"
                v-if="selectAll"
              >
                <b class="selectedContacts__title">
                  Recipients: All contacts{{ allUsersCountText }}
                </b>
              </div>
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
            <div class="msg-no-chat" v-if="!selectedUsers.length">
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
            :excludedUserIds="deselected"
            :toAll="selectAll"
            :disable="sending"
            :excludeStars="excludeStars"
            :excludeSubscribers="excludeSubscribers"
            :recipientsCount="recipientsCount"
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
import IntersectionObserver from "@/mixins/intersectionObserver";

export default {
  name: "Chat",

  mixins: [User, ModalRouterGoto, IntersectionObserver],

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
      deselected: [],
      searchQuery: "",
      chatOptionsOpened: false,
      contactsScrollTop: true,
      sending: false,
      selectAll: false,
      excludeStars: true,
      excludeSubscribers: true,
      allFoundSelected: false
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
      return chats;
    },
    selectedChats() {
      return this.chats.filter(v => v.selected);
    },
    hasSelectedUsers() {
      return this.selectAll || !!this.selectedUsers.length;
    },
    _foundUsers() {
      return this.$store.state.chat.chatUsers;
    },
    foundUsers() {
      // if (this._foundUsers) {
      if (this._foundUsers && !this.selectAll) {
        return this._foundUsers;
      }
      if (this.searchQuery) {
        return [];
      }
      return this.chats.map(v => v.withUser);
    },
    selectedUser() {
      if (this.selected.length !== 1) {
        return null;
      }
      const chat = this.chats.find(v => v.withUser.id === this.selected[0]);
      if (!chat) {
        return null;
      }
      return chat.withUser;
    },
    selectedUsers() {
      return this.foundUsers.filter(v => {
        return this.selected.indexOf(v.id) !== -1;
      });
    },
    allUsersCount() {
      return this.$store.state.chat.fetchAllUsersCountResult;
    },
    recipientsCount() {
      if (!this.allUsersCount) {
        return null;
      }
      let n = this.allUsersCount.count;
      if (this.excludeStars && this.excludeSubscribers) {
        n -= this.allUsersCount.starsSubscribers;
      } else if (this.excludeStars && !this.excludeSubscribers) {
        n -= this.allUsersCount.stars;
      } else if (!this.excludeStars && this.excludeSubscribers) {
        n -= this.allUsersCount.subscribers;
      }
      return n - this.deselected.length;
    },
    allUsersCountText() {
      return " (" + this.recipientsCount + ")";
    },
    // allUsersCountExtraText() {
    //   const n = this.excludeStars
    //     ? this.allUsersCountExcludingStars
    //     : this.allUsersCount;
    //   const text = this.excludeStars
    //     ? "excluding AVN Stars"
    //     : "including AVN Stars";
    //   if (n) {
    //     return " " + text;
    //   }
    //   return null;
    // },
    usersSearching() {
      return this.$store.state.chat.searchUsersLoading;
    },
    allDataRecieved() {
      return this.$store.state.chat.allDataReceived;
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
    toggleDeselect(id) {
      if (this.deselected.indexOf(id) !== -1) {
        this.deselected = this.deselected.filter(_id => _id !== id);
      } else {
        this.deselected.push(id);
      }
    },
    isSelected(id) {
      return this.selected.indexOf(id) !== -1;
    },
    isDeselected(id) {
      return this.deselected.indexOf(id) !== -1;
    },
    toggleSelectAll() {
      if (this.searchQuery) {
        this.toggleSelectAllFoundUsers();
      } else {
        this._toggleSelectAll();
      }
    },
    _toggleSelectAll() {
      this.selectAll = !this.selectAll;
      if (this.selectAll) {
        this.selected = [];
      } else {
        this.deselected = [];
      }
    },
    toggleSelectAllFoundUsers() {
      if (this.allFoundSelected) {
        this.allFoundSelected = false;
        this.selected = [];
      } else {
        this.allFoundSelected = true;
        this.selected = this.foundUsers.map(v => v.id);
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
        this.searchId = 0;
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
      if (this.selected.length === 1) {
        this.goTo("/chat/" + this.selected[0]);
      } else {
        this.goTo("/chat");
      }
    },
    reset() {
      this.searchQuery = "";
      this.$store.commit("chat/resetSearchUsers");
    },
    newFetchAnyChats() {
      const data = {
        excludeStars: this.excludeStars,
        excludeSubscribers: this.excludeSubscribers,
        selectAll: this.selectAll
      };
      this.$store.dispatch("chat/getFetchAnyChats", data).then(() => {
        this.isInitFetch = false;
        this.handleResponseWithIntersectionObserver(this.newFetchAnyChats);
      });
    },
    resetFetchData() {
      this.$store.commit("chat/fetchChatsReset");
      this.destroyObserver();
      this.isInitFetch = true;
    }
  },

  watch: {
    selectAll() {
      this.resetFetchData();
      this.newFetchAnyChats();
    },
    excludeStars() {
      this.resetFetchData();
      this.newFetchAnyChats();
    },
    excludeSubscribers() {
      this.resetFetchData();
      this.newFetchAnyChats();
    }
  },

  created() {
    this.$store.commit("chat/fetchChatsReset");
    this.newFetchAnyChats();
    // this.$store.dispatch("chat/getFetchAnyChats", {});
    this.$store.dispatch("chat/fetchAllUsersCount", {});
    // this.$store.dispatch("chat/fetchUsersCountWithoutStars", {});
    this.search();
  },
  beforeDestroy() {
    this.resetFetchData();
    this.$store.commit("chat/setSecondScreen", false);
  }
};
</script>
