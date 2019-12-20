<template>
  <AddMessageBox
    @send="sendMessage"
    :disable="disable"
    :withFontSizeController="false"
    :allUsersCount="allUsersCount"
    :confirmation="toAll"
  />
</template>

<script>
import AddMessageBox from "./AddMessageBox";

export default {
  name: "ChatAddMultiMessage",

  components: {
    AddMessageBox
  },

  props: {
    userIds: {
      type: Array
    },
    toAll: {
      type: Boolean
    },
    disable: {
      type: Boolean,
      default: false
    },
    allUsersCount: {
      type: Number,
      default: 0
    }
  },

  methods: {
    async sendMessage(message) {
      this.$emit("startSending");
      const params = { ...message };
      if (this.toAll) {
        params.toAll = this.toAll;
      } else {
        params.ids = this.userIds;
      }
      await this.$store.dispatch("chat/sendMultiMessages", params);
      this.$store.dispatch("global/flashToast", {
        text: "Messages sent successfully"
      });
      this.$emit("sent");
    }
  }
};
</script>
