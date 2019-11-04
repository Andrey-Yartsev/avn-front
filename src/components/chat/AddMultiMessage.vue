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
      type: Array,
      required: true
    },
    disable: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    async sendMessage(message) {
      this.$emit("startSending");
      await this.$store.dispatch("chat/sendMultiMessages", {
        ...message,
        ...{ ids: this.userIds }
      });
      this.$store.dispatch("global/flashToast", {
        text: "Messages sent successfully"
      });
      this.$emit("sent");
    }
  }
};
</script>
