<template>
  <AddMessageBox @send="sendMessage"/>
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
    }
  },

  methods: {
    async sendMessage(message) {
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
