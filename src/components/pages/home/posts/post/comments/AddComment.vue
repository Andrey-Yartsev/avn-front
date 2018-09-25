<template>
    <form class="comment-form">
        <input class="comment-input rounded" placeholder="Add a comment" v-model="message">
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
  methods: {
    sendComment() {
      this.$emit("postAddComment", this.message);
      this.message = "";
    }
  }
};
</script>
