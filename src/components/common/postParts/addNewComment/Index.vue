<template>
  <form class="comment-form">
    <TextareaAutosize
      class="comment-input rounded"
      placeholder="Add a comment"
      rows="1"
      v-model="message"
      ref="message"
      maxlength="200"
      :minHeight="30"
      :maxHeight="85"
      @keypress.enter.prevent="sendComment"
    ></TextareaAutosize>
    <button
      type="submit"
      class="btn comment-btn"
      v-bind:disabled="!message.trim().length"
      @click.prevent="sendComment"
    >
      Post
    </button>
  </form>
</template>

<script>
import TextareaAutosize from "@/components/common/TextareaAutosize";

export default {
  name: "AddComment",
  components: {
    TextareaAutosize
  },
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
      this.$refs.message.$el.focus();
    }
  }
};
</script>
