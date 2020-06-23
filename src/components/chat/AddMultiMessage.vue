<template>
  <AddMessageBox
    @send="sendMessage"
    :disable="disable"
    :withFontSizeController="false"
    :recipientsCount="recipientsCount"
    :confirmation="toAll"
    :multipleMedia="true"
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
    recipientsCount: {
      type: Number,
      default: 0
    },
    excludeStars: {
      type: Boolean,
      default: true
    }
  },

  methods: {
    // excludeStars

    async sendMessage(message) {
      this.$emit("startSending");
      const data = { ...message };
      if (this.toAll) {
        data.toAll = this.toAll;
      } else {
        data.ids = this.userIds;
      }
      await this.$store.dispatch("chat/sendMultiMessages", {
        query: {
          "with-stars": !this.excludeStars
        },
        data
      });
      this.$store.dispatch("global/flashToast", {
        text: "Messages sent successfully"
      });
      this.$emit("sent");
    }
  }
};
</script>
