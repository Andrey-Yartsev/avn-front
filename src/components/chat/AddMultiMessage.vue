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
    excludedUserIds: {
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
    },
    excludeSubscribers: {
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
        data.excluded = this.excludedUserIds;
        data.withStars = !this.excludeStars;
        data.withSubscribers = !this.excludeSubscribers;
      } else {
        data.ids = this.userIds;
      }
      try {
        await this.$store.dispatch("chat/sendMultiMessages", {
          data
        });
        this.$store.dispatch("global/flashToast", {
          text: "Messages sent successfully"
        });
      } catch (err) {
        this.$store.dispatch("global/flashToast", {
          text: err.message,
          type: "error"
        });
      }
      this.$emit("sent");
    }
  }
};
</script>
