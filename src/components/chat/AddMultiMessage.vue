<template>
  <AddMessageBox @send="sendMessage" :disable="disable" />
</template>

<script>
import AddMessageBox from "./AddMessageBox";

const timeout = ms => new Promise(res => setTimeout(res, ms));

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
      for (const userId of this.userIds) {
        await this.$store.dispatch("chat/sendMessage", {
          userId,
          data: message
        });
        await timeout(500);
      }
      this.$emit("sent");
    }
  }
};
</script>
