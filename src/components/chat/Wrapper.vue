<template>
  <div
    id="chatCollectionContent"
    class="chatCollectionContent"
    :class="{
      chat: isSecondScreen,
      'no-chats': noActiveChats,
      'page-block': mode !== 'modal'
    }"
    @scroll="onScroll"
  >
    <template>
      <div class="chatHeader">
        <div class="contactsListHeader main-header">
          <a
            :href="'/' + user.username"
            class="avatar header-avatar"
            @click.prevent="openUserMobileBar"
          >
            <span class="avatar__img">
              <img v-if="user.avatar" :src="user.avatar" />
            </span>
          </a>
          <h3>Messages</h3>
          <div class="newMessage-link">
            <a
              href="/chat/new"
              @click.prevent="goTo('/chat/new')"
              class="newMessage"
              >New message
              <span class="icn-msg icn-item icn-size_lg"></span>
            </a>
          </div>
        </div>
      </div>
      <MobileHeader activeName="chat" v-if="$mq === 'mobile'" />
    </template>

    <div class="loader-container loader-container_center" v-if="loading">
      <Loader
        :fullscreen="false"
        class="overlay_fulllight small main-chat-loader"
      />
    </div>

    <div class="chatCollectionContent__col chatCollectionContent__col_narrow">
      <div class="chat-container">
        <slot name="col1"></slot>
      </div>
    </div>
    <div class="chatCollectionContent__col chatCollectionContent__col_wide">
      <slot name="col2"></slot>
    </div>
    <slot name="extra"></slot>

    <Footer class="hidden-desktop" v-if="$mq === 'mobile'" />
  </div>
</template>

<script>
import ModalRouterParams from "@/mixins/modalRouter/params";
import User from "@/mixins/user";
import MobileHeader from "@/components/header/Mobile";
import Footer from "@/components/footer/Index.vue";
import StickyHeader from "@/mixins/stickyHeader";
import Loader from "@/components/common/Loader";

export default {
  name: "ChatWrapper",

  mixins: [ModalRouterParams, User, StickyHeader],

  components: {
    MobileHeader,
    Footer,
    Loader
  },

  computed: {
    loading() {
      return (
        this.$store.state.chat.chatsLoading ||
        this.$store.state.chat.fetchAnyChatsLoading
      );
    },
    isSecondScreen() {
      if (this.$store.state.chat.isSecondScreen) {
        return true;
      }
      return !!parseInt(this.routeParams.userId);
    },
    isNew() {
      return this.routePath === "chat/new";
    },
    routePath() {
      return this.$store.state.modalRouter.path;
    },
    noActiveChats() {
      if (this.$store.state.chat.chats.length) {
        return false;
      } else if (this.$store.state.chat.activeUserId) {
        return false;
      }
      return true;
    }
  },

  methods: {
    openUserMobileBar() {
      this.$store.dispatch("global/openUserMobileBar");
    }
  }
};
</script>
