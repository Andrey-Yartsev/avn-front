<template>
  <div>
    <div v-if="showAcceptBox" class="acceptChatBox bg-gradient_light">
      <div class="acceptChatBox__header semi-transparent">
        Do you want to let {{ withUser.name }} message you?<br />
        They won't know you've seen their message until you accept.
      </div>
      <div class="acceptChatBox__buttonContainer">
        <button
          type="button"
          class="btn border btn_fix-width-md "
          @click="reject"
        >
          Reject
        </button>
        <button
          type="button"
          class="btn btn_reset-mgap alt border btn_fix-width-md"
          @click="accept"
        >
          Accept
        </button>
      </div>
    </div>
    <template v-else-if="!loading">
      <AddMessageBox
        @send="sendMessage"
        :withUser="withUser"
        :withFontSizeController="true"
        :multipleMedia="true"
      />
    </template>
  </div>
</template>

<script>
import AddMessageBox from "./AddMessageBox";
import ModalRouterGoto from "@/mixins/modalRouter/goto";

export default {
  name: "ChatAddMessage",

  components: {
    AddMessageBox
  },

  mixins: [ModalRouterGoto],

  props: {
    withUser: {
      type: Object,
      required: true
    },
    messages: {
      type: Array
    }
  },

  computed: {
    user() {
      return this.$store.state.auth.user;
    },
    showAcceptBox() {
      return this.messages.length && this.isRequestedChat;
    },
    chatsFilter() {
      return this.$store.state.chat.chatsFilter;
    },
    isRequestedChat() {
      return this.chatsFilter === "requested";
    },
    loading() {
      return this.$store.state.chat._fetchMessagesLoading;
    }
  },

  methods: {
    sendMessage(data) {
      this.$store.dispatch("chat/sendMessage", {
        userId: this.withUser.id,
        data
      });
    },
    reject() {
      this.$emit("deleteConversation");
    },
    accept() {
      this.$store
        .dispatch("chat/acceptChat", {
          userId: this.withUser.id
        })
        .then(() => {
          this.goTo("/chat/" + this.withUser.id);
        });
    }
  }
};
</script>
