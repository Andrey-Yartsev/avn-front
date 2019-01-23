<template>
    <div class="chatCollectionContent" :class="{chat: isSecondScreen}">

      <template>
        <div class="chatHeader">
          <div class="contactsListHeader">
            <a
              :href="'/' + user.username"
              class="avatar header-avatar"
              @click.prevent="openUserMobileBar"
            >
              <span class="avatar__img">
                <img v-if="user.avatar" :src="user.avatar">
              </span>
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
          <MobileHeader activeName="chat" />
        </div>
      </template>

      <div class="chatCollectionContent__col chatCollectionContent__col_narrow">
        <div class="chat-container">
          <slot name="col1"></slot>
        </div>
      </div>
      <div class="chatCollectionContent__col chatCollectionContent__col_wide">
        <slot name="col2"></slot>
      </div>
      <slot name="extra"></slot>

      <Footer class="hidden-desktop" />
    </div>
</template>

<script>
import ModalRouterParams from "@/mixins/modalRouter/params";
import User from "@/mixins/user";
import MobileHeader from "@/components/header/Mobile";
import Footer from "@/components/footer/Index.vue";

export default {
  name: "ChatWrapper",

  mixins: [ModalRouterParams, User],

  components: {
    MobileHeader,
    Footer
  },

  computed: {
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
    }
  },

  methods: {
    openUserMobileBar() {
      this.$store.dispatch("global/openUserMobileBar");
    }
  }
};
</script>
