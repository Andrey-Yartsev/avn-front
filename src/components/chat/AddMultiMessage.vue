<template>
  <AddMessageBox @send="sendMessage"/>
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
    }
  },

  methods: {
    sendMessage(message) {
      this.userIds.forEach(userId => {
        this.$store.dispatch("chat/sendMessage", {
          userId,
          message
        });
      });
      this.$emit("sent");
    }
  }
};
</script>
