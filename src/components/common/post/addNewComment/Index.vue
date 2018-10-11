<template>
    <form class="comment-form">
        <textarea
          class="comment-input rounded"
          placeholder="Add a comment"
          rows="1"
          v-model="message"
          ref="message"
          @keypress.enter.prevent="sendComment"
        ></textarea>
        <button 
            type="submit"
            class="btn comment-btn"
            v-bind:disabled="!message.length"
            @click.prevent="sendComment"
        >Post</button>
    </form>
</template>

<script>
export default {
  name: "AddComment",
  data: () => ({
    message: ""
  }),
  props: {
    sendNewComment: {
      type: Function,
      required: true
    },
    userName: {
      type: String,
      default: ""
    }
  },
  methods: {
    sendComment() {
      this.sendNewComment(this.message);
      this.message = "";
    }
  },
  watch: {
    userName: function() {
      this.message = `@${this.userName}, `;
      this.$refs.message.focus();
    }
  }
};
</script>
