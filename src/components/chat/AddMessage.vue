<template>
  <AddMessageBox
    @send="sendMessage"
    :withUser="withUser"
    :withFontSizeController="true"
    :multipleMedia="true"
  />
</template>

<script>
import AddMessageBox from "./AddMessageBox";

export default {
  name: "ChatAddMessage",

  components: {
    AddMessageBox
  },

  props: {
    withUser: {
      type: Object,
      required: true
    }
  },

  methods: {
    sendMessage(data) {
      this.$store.dispatch("chat/sendMessage", {
        userId: this.withUser.id,
        data
      });
    }
  }
};
</script>
