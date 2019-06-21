<template>
  <form class="comment-form">
    <vue-tribute :options="tributeOptions">
      <TextareaAutosize
        id="comment_message"
        class="comment-input rounded"
        placeholder="Add a comment"
        rows="1"
        v-model="message"
        ref="message"
        maxlength="200"
        :minHeight="30"
        :maxHeight="85"
        @keypress.enter.prevent="sendComment"
      />
    </vue-tribute>
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
import VueTribute from "vue-tribute";

export default {
  name: "AddComment",
  components: {
    TextareaAutosize,
    VueTribute
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
  computed: {
    tributeOptions() {
      return {
        values: this.usersSearch,
        lookup: "name",
        fillAttr: "name",
        selectTemplate: function(item) {
          if (typeof item === "undefined") {
            return null;
          }
          return "@" + item.original.username;
        },
        menuItemTemplate: function(item) {
          let template = ``;
          template += `<span contenteditable="false">
<a tabindex="2" class="user">
  <span class="avatar avatar_gap-r-sm avatar_sm">
    <span class="avatar__img">`;
          if (item.original.avatar) {
            template += `<img src="${item.original.avatar}">`;
          }
          template += `</span>`;
          template += `
  </span>
  </span>
  <div class="username-group">
    <div class="user__name">
      <div class="name">${item.original.name}</div>
      <span class="verified-user icn-item"></span>
    </div>
    <span class="user-login reset-ml">${item.original.username}</span>
  </div>
</a>
</span>
`;
          return template;
        }
      };
    }
  },
  methods: {
    sendComment() {
      this.sendNewComment(this.message);
      this.message = "";
    },
    usersSearch(text, cb) {
      this.$store.dispatch("search/tribute/search", text).then(result => {
        cb(result.list);
      });
    }
  },
  watch: {
    userName: function() {
      this.message = `@${this.userName} `;
      this.$refs.message.$el.focus();
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.message.$el.addEventListener("tribute-replaced", () => {
        this.message = this.$refs.message.$el.value;
      });
    }, 0);
  }
};
</script>
