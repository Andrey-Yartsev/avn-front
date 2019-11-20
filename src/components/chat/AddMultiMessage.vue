<template>
  <AddMessageBox
    @send="sendMessage"
    :disable="disable"
    :withFontSizeController="false"
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
    }
  },

  methods: {
    async sendMessage(message) {
      this.$emit("startSending");
      const params = { message };
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
