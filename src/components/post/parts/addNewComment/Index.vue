<template>
  <form class="comment-form" :class="{ 'comment-form_clear-btn': canSend }">
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
        @enter="sendComment"
        @tribute-replaced="tributeHandler"
      />
      <span
        role="button"
        tabindex="-1"
        id="comment-input-clear"
        class="btn-clear-search icn-item btn-reset btn-reset_prim-color icn-pos_center"
        v-if="canSend"
        @click="reset"
      />
    </vue-tribute>
    <button
      type="submit"
      class="btn comment-btn"
      :disabled="!canSend"
      @click.prevent="sendComment"
    >
      Post
    </button>
  </form>
</template>

<script>
import TextareaAutosize from "@/components/common/TextareaAutosize";
import VueTribute from "vue-tribute";
import PaidBlock from "@/mixins/paidBlock";

export default {
  name: "AddComment",
  components: {
    TextareaAutosize,
    VueTribute
  },
  mixins: [PaidBlock],
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
    },
    author: {
      type: Object
    }
  },
  computed: {
    tributeOptions() {
      return {
        values: this.usersSearch,
        lookup: "name",
        fillAttr: "name",
        noMatchTemplate: function() {
          return "<span class='no-results'>nothing found</span>";
        },
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
  <div class="username-group">
    <div class="user__name">
      <div class="name">${item.original.name}</div>`;
          if (item.original.isVerified) {
            template += `<span class="verified-user icn-item"></span>`;
          }
          template += `</div>
    <span class="user-login reset-ml">${item.original.username}</span>
  </div>
</a>
</span>
`;
          return template;
        }
      };
    },
    canSend() {
      if (!this.message) {
        return false;
      }
      return !!this.message.trim();
    }
  },
  methods: {
    sendComment() {
      if (this.isPaidBlockedBy(this.author.id)) {
        this.openPaidUnblockModal(this.author.id);
        return;
      }
      this.sendNewComment(this.message);
      this.message = "";
    },
    usersSearch(text, cb) {
      this.$store.dispatch("search/tribute/search", text).then(result => {
        cb(result.list);
      });
    },
    tributeHandler() {
      this.message = this.$refs.message.$el.value;
    },
    reset() {
      this.message = "";
    }
  },
  watch: {
    userName: function() {
      if (this.userName) {
        this.message = `@${this.userName} `;
      } else {
        this.reset();
      }
      this.$refs.message.$el.focus();
    },
    message: function() {
      if (!this.message) {
        this.$emit("reset");
      }
    }
  }
};
</script>
