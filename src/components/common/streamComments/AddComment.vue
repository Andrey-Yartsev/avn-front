<template>
  <form class="form-comments__wrapper">
    <textarea
      ref="commentInput"
      placeholder="Comment"
      class="form-comments__input rounded lg"
      maxlength="200"
      v-model="newComment"
      @keypress.enter.prevent="sendComment"
    />
    <button
      @click="sendComment"
      type="button"
      class="btn-send btn-send_inside-field icn-item icn-size_lg"
      :disabled="!newComment.length"
    ></button>
  </form>
</template>

<script>
export default {
  name: "StreamAddComment",
  props: {
    _stream: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      newComment: ""
    };
  },
  computed: {
    stream() {
      if (this._stream) {
        return this._stream;
      }
      return this.$store.state.modal.stream.data.stream;
    }
  },
  methods: {
    sendComment() {
      if (!this.newComment.trim()) {
        this.newComment = "";
        return;
      }

      const token = this.$store.state.auth.token;
      const id = this.stream.id;
      const userId = this.stream.user.id;

      this.$root.ws.send({
        act: "stream_comment",
        stream_user_id: userId,
        stream_id: id,
        comment: this.newComment,
        sess: token
      });
      this.newComment = "";
    },
    focus() {
      this.$nextTick(() => {
        this.$refs.commentInput.focus();
      });
    }
  }
};
</script>
