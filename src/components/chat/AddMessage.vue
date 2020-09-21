<template>
  <div>
    <div v-if="showAcceptBox" class="acceptChatBox bg-gradient_light">
      <template v-if="viewType === 'accept'">
        <div class="acceptChatBox__header semi-transparent">
          Do you want to let {{ withUser.name }} message you?<br />
          They won't know you've seen their message until you accept.
        </div>
        <div class="acceptChatBox__buttonContainer">
          <button
            type="button"
            class="btn border neutral btn_fix-width-md "
            @click="switchViewType('blockOrReport')"
          >
            Block or report
          </button>
          <button
            type="button"
            class="btn border btn_fix-width-md "
            @click="reject"
          >
            Delete
          </button>
          <button
            type="button"
            class="btn btn_reset-mgap alt border btn_fix-width-md"
            @click="accept"
          >
            Accept
          </button>
        </div>
      </template>
      <template v-else-if="viewType === 'blockOrReport'">
        <div class="acceptChatBox__buttonContainer">
          <button
            type="button"
            class="btn border btn_fix-width-md "
            @click="block"
          >
            Block
          </button>
          <div class="info-message">
            Blocking will prevent this person from sending you message requests
            in future.
          </div>
          <button
            type="button"
            class="btn border btn_fix-width-md "
            @click="switchViewType('report')"
          >
            Report
          </button>
          <div class="info-message">
            Let AVN know about spam or abuse so we can help protect others from
            account like this.
          </div>
          <button
            type="button"
            class="btn btn_reset-mgap neutral border btn_fix-width-md"
            @click="switchViewType('accept')"
          >
            Cancel
          </button>
        </div>
      </template>
      <template v-else-if="viewType === 'report'">
        <div class="acceptChatBox__header semi-transparent">
          Are you sure you want to report {{ withUser.name }} ?<br />
          The conversation will be deleted from your inbox.
          {{ withUser.name }} cannot message you again unless you message them
          first.
        </div>
        <div class="acceptChatBox__buttonContainer">
          <button
            type="button"
            class="btn border btn_fix-width-md "
            @click="report"
          >
            Yes, report spam
          </button>
          <button
            type="button"
            class="btn btn_reset-mgap neutral border btn_fix-width-md"
            @click="switchViewType('blockOrReport')"
          >
            Cancel
          </button>
        </div>
      </template>
      <template v-else-if="viewType === 'reportSuccess'">
        <div class="acceptChatBox__header semi-transparent">
          Thanks for letting us know.<br />
          If @{{ withUser.name }} is found to have violated AVN Stars Terms we
          will take action on it.<br />
          We will prevent further messages from @{{ withUser.name }} from being
          delivered to your inbox unless you message them first.<br />
          You might consider blocking this account so they will no longer be
          able to follow you.
        </div>
        <div class="acceptChatBox__buttonContainer">
          <button
            type="button"
            class="btn border btn_fix-width-md "
            @click="block"
          >
            Block
          </button>
          <button
            type="button"
            class="btn btn_reset-mgap neutral border btn_fix-width-md"
            @click="close"
          >
            Close
          </button>
        </div>
      </template>
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

  data() {
    return {
      viewType: "accept" // 4 posible types - 'accept' || 'blockOrReport' || 'report' || 'reportSuccess'
    };
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
    },
    switchViewType(type) {
      this.viewType = type;
    },
    block() {
      this.$store.dispatch("chat/blockUser", this.withUser.id).then(() => {
        this.$store.dispatch("global/flashToast", {
          text: `${this.withUser.name} was blocked`,
          type: "warning"
        });
        this.$emit("deleteConversation");
      });
    },
    report() {
      this.$store
        .dispatch("chat/reportSpam", { userId: this.withUser.id })
        .then(() => {
          this.viewType = "reportSuccess";
        });
    },
    close() {
      this.goTo("/chat");
      this.$store.commit("chat/setChatsFilter", "all");
      this.$store.commit("chat/decrementRequestedChatsCount");
    }
  }
};
</script>
