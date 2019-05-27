<template>
  <div class="comment" :class="{ 'comment-answer': !!comment.answerTo }">
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
        <a
          v-if="comment.author"
          :href="'/' + comment.author.username"
          @click.prevent="$router.push('/' + comment.author.username)"
          class="comment-author-name name"
          ref="name"
          @mouseover="showBubble"
          @mouseout="hideBubble"
          >{{ comment.author.name }}</a
        >
        <div v-if="comment.text.length > collapseLimit" class="comment-text">
          <span v-html="trunc(comment.text)"></span>
          <a href="#" @click.prevent="collapsed = !collapsed">{{
            collapsed ? "Read more" : "Collapse"
          }}</a>
        </div>
        <div v-else class="comment-text" v-html="comment.text" ref="text" />
      </div>
      <div class="comment-footer" v-if="full">
        <time class="timestamp">{{ dateTime }}</time>
        <span v-if="comment.likesCount" class="likes-count"
          >{{ comment.likesCount }} likes</span
        >
        <button
          type="button"
          class="post-option btn-reply"
          @click="$emit('commentReply', comment)"
        >
          Reply
        </button>
        <button
          v-if="comment.canDelete"
          type="button"
          class="post-option btn-remove"
          @click="$emit('commentRemove', comment)"
        >
          Remove
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
      >
        <span class="likes likes_size-sm likes_reset-gap-r"></span>
      </button>
    </div>
  </div>
</template>

<script>
import { fromNow } from "@/helpers/datetime";
import Bubble from "@/helpers/userBubble";

export default {
  name: "Comment",
  props: {
    comment: {
      type: Object,
      required: true
    },
    full: {
      type: Boolean,
      default: true
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
      return fromNow(this.comment.postedAt);
    }
  },
  methods: {
    trunc(html) {
      if (this.collapsed) {
        return html.substring(0, this.collapseLimit) + "…";
      } else {
        return html;
      }
    },
    showBubble() {
      Bubble.open({
        a: this.$refs.name,
        username: this.comment.author.username
      });
    },
    hideBubble() {
      Bubble.hide();
    }
  },
  mounted() {
    if (this.$mq === "mobile") {
      return;
    }
    if (this.$refs.text) {
      const aTags = this.$refs.text.getElementsByTagName("a");
      if (aTags && aTags.length) {
        for (let a of aTags) {
          if (!a.innerText.match(/^@(.*)/)) {
            continue;
          }
          a.addEventListener("mouseover", () => {
            Bubble.open({ a });
          });
          a.addEventListener("mouseout", Bubble.hide);
        }
      }
    }
  }
};
</script>
