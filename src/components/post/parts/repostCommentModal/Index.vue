<template>
  <div :class="['addPost']" v-click-outside="() => (expanded = false)">
    <form
      :class="[
        'add-new-form',
        {
          expanded: true,
          'bg-gradient_light': $mq === 'desktop'
        }
      ]"
    >
      <div class="addPost-header" v-if="$mq === 'mobile'">
        <button
          type="button"
          class="header-return-btn go-back go-back_times"
          @click="close"
        >
          <h1 class="category-name">
            Add Comment
          </h1>
        </button>

        <div class="addPost-header__controls">
          <button
            type="submit"
            class="btn submit sm"
            :disabled="notEhoughData"
            @click.prevent="clickHandler"
          >
            Repost
          </button>
        </div>
      </div>
      <span
        class="avatar avatar_not-shadow avatar_gap-r-md avatar_sm hidden-mobile"
        v-if="$mq === 'desktop'"
      >
        <span class="avatar__img">
          <img v-if="user.avatar" :src="user.avatar" />
        </span>
      </span>
      <div
        class="text-media-container"
        :class="{ 'text-field-border': $mq === 'desktop' }"
      >
        <vue-tribute :options="tributeOptions">
          <textarea
            @focus="() => (expanded = true)"
            class="sm content-editable textarea"
            contenteditable
            placeholder="What's going on?"
            maxlength="1000"
            rows="4"
            @input="textInput"
            ref="textarea"
          ></textarea>
        </vue-tribute>
      </div>
      <div class="actions">
        <button
          type="submit"
          class="btn submit hidden-mobile"
          :disabled="notEhoughData"
          @click.prevent="clickHandler"
          v-if="$mq === 'desktop'"
        >
          Repost
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";
import ClickOutside from "vue-click-outside";
import UserMixin from "@/mixins/user";
import "vue-datetime/dist/vue-datetime.css";
import VueTribute from "vue-tribute";
import UserSuggestions from "@/mixins/userSuggestions";

const InitialState = {
  expanded: true,
  comment: ""
};

export default {
  name: "AddComment",
  mixins: [UserMixin, UserSuggestions],
  data() {
    return {
      ...InitialState
    };
  },
  components: {
    Loader,
    VueTribute
  },
  props: {
    initialExpanded: {
      type: Boolean,
      default: false
    },
    close: {
      type: Function,
      default: () => {}
    },
    where: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      required: true
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user;
    },
    notEhoughData() {
      return !this.comment.trim().length;
    },
    isExtended() {
      return this.expanded;
    },
    postId() {
      return this.$store.state.modal.postRepostComment.data.postId;
    }
  },
  methods: {
    clickHandler() {
      if (this.notEhoughData) {
        return;
      }
      this.$store.dispatch("profile/home/repost", {
        postId: this.postId,
        comment: this.comment
      });
      this.close();
    },
    reset() {
      this.expanded = InitialState.expanded;
      this.comment = InitialState.comment;
    },

    // user suggestions API
    textInput() {
      this.comment = this.$refs.textarea.value;
    },
    getText() {
      return this.comment;
    }
  },
  mounted() {
    if (this.$refs.textarea) {
      this.$refs.textarea.focus();
    }

    this.popupItem = this.$el;
  },
  directives: {
    ClickOutside
  }
};
</script>

<style lang="scss" scoped>
.actions {
  width: 100%;
  height: 50px;
  .btn.submit {
    display: block;
    margin-left: auto;
    margin-top: 10px;
  }
}
</style>
