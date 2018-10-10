<template>
    <form class="comment-form">
        <textarea class="comment-input rounded" placeholder="Add a comment" rows="1" v-model="message"></textarea>
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
    }
  },
  methods: {
    sendComment() {
      this.sendNewComment(this.message);
      this.message = "";
    }
  }
};
</script>
