<template>
  <div class="comment">
    <router-link
      v-if="comment.author && full"
      :to="'/' + comment.author.username"
      class="avatar avatar_gap-r-sm avatar_sm"
    >
      <span class="avatar__img">
        <img v-if="comment.author.avatar" :src="comment.author.avatar" />
      </span>
    </router-link>
    <div class="comment-content">
      <div class="comment-body">
        <router-link
          v-if="comment.author"
          :to="'/' + comment.author.username"
          class="comment-author-name name"
          >{{ comment.author.name }}</router-link
        >
        <div v-if="comment.text.length > collapseLimit" class="comment-text">
          <span v-html="trunc(comment.text)"></span>&nbsp;
          <a href="#" @click.prevent="collapsed = !collapsed">{{
            collapsed ? "Read more" : "Collapse"
          }}</a>
        </div>
        <div v-else class="comment-text" v-html="comment.text" />
      </div>
      <div class="comment-footer" v-if="full">
        <time class="timestamp">{{ dateTime }}</time>
        <span v-if="comment.likesCount" class="likes-count"
          >{{ comment.likesCount }} likes</span
        >
        <button
          type="button"
          class="btn-reply"
          @click="$emit('commentReply', comment.author.username)"
        >
          Reply
        </button>
      </div>
      <button
        :class="['btn-like', { active: comment.isLiked }]"
        v-if="full"
        @click="
          $emit('likeComment', {
            commentId: comment.id,
            isLiked: comment.isLiked
          })
        "
      ></button>
    </div>
  </div>
</template>

<script>
import datetimeHelper from "@/helpers/datetime";

export default {
  name: "Comment",
  props: {
    comment: {
      type: Object,
      required: true
    },
    full: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      collapseLimit: 250,
      collapsed: true
    };
  },
  computed: {
    dateTime: function() {
      return datetimeHelper(this.comment.postedAt);
    }
  },
  methods: {
    trunc(html) {
      if (this.collapsed) {
        return html.substring(0, this.collapseLimit) + "…";
      } else {
        return html;
      }
    }
  }
};
</script>
