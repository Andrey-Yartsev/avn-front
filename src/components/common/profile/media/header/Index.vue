<template>
  <div class="post-header">
    <router-link
      class="avatar avatar_gap-r-sm avatar_sm"
      :to="'/' + postUser.username"
      :class="{ 'online-state': isOnline(postUser.id) }"
    >
      <span class="avatar__img">
        <img v-if="postUser.avatar" :src="postUser.avatar" />
      </span>
    </router-link>
    <a
      class="name"
      :href="'/' + postUser.username"
      ref="name"
      @click.prevent="$router.push('/' + postUser.username).catch(() => {})"
      @mouseover="showBubble"
      @mouseout="hideBubble"
      >{{ postUser.name }}</a
    >
    <template v-if="postUser.isActive">
      <span class="verified-user icn-item"></span>
    </template>
    <span class="user-login">
      <a
        :href="'/' + postUser.username"
        @click.prevent="$router.push('/' + postUser.username)"
        @mouseover="showBubble"
        @mouseout="hideBubble"
        >{{ postUser.username }}</a
      >
    </span>
    <span class="follow-link hidden">Follow</span>
    <span class="follow-link hidden">Follow</span>
    <time class="timestamp" v-if="datetime">
      {{ datetime }}
    </time>
    <span
      v-if="post.isPinned && isAuth()"
      class="icn-item icn-pinned icn-size_lg"
    />
    <template v-if="isAuthor">
      <span class="actionsContainer">
        <span
          class="labelWrapper"
          v-if="post.media.preview.source && view === 'large'"
        >
          <label class="labelWrapper__label" for="is_paid_subscription"
            >Video</label
          >
          <label class="toggle-element">
            <input
              type="checkbox"
              id="is_paid_subscription"
              name="isWantEarn"
              :value="showPreview"
              @change="$emit('switchToPreview')"
            />
            <span class="toggle-element_switcher"></span>
          </label>
          <span class="labelWrapper__label">Preview</span>
        </span>
        <span v-if="post.active" class="mediaStatus isActive">
          <span class="icn-item verified-user" />
          Active
        </span>
        <span v-else class="mediaStatus notActive">
          <span class="icn-item icn-block" />
          Not active
        </span>
        <span
          v-tooltip="'Copy link'"
          class="icn-item icon-link"
          @click="copyHref"
        ></span>
        <span class="btn editButton" v-if="isAuthor" @click.prevent="editPost"
          >Edit</span
        >
      </span>
    </template>
  </div>
</template>

<script>
import Dropdown from "@/components/common/profile/media/header/Dropdown";
import ClickOutside from "vue-click-outside";
import Bubble from "@/helpers/userBubble";
import User from "@/mixins/user";

export default {
  name: "Header",
  mixins: [User],
  components: {
    Dropdown
  },
  data: () => ({
    opened: false
  }),
  props: {
    datetime: {
      type: String,
      default: undefined
    },
    post: {
      type: Object,
      required: true
    },
    from: {
      type: String,
      required: true
    },
    showCopy: {
      type: Boolean,
      required: true
    },
    isAuthor: {
      type: Boolean,
      required: true
    },
    switchToPreview: {
      type: Function
    },
    showPreview: {
      type: Boolean
    },
    view: {
      type: String
    }
  },
  computed: {
    postId() {
      return this.post.productId;
    },
    postUser() {
      return this.post.author;
    },
    href() {
      const { protocol, port, hostname } = window.location;
      return (
        `${protocol}//${hostname}` +
        (port ? ":" + port : "") +
        `/media/${this.postId}`
      );
    }
  },
  methods: {
    open() {
      this.opened = true;
      this.$emit("openDropdown");
    },
    hide() {
      this.opened = false;
      this.$emit("hideDropdown");
    },
    showBubble() {
      Bubble.open({
        a: this.$refs.name,
        username: this.postUser.username
      });
    },
    hideBubble() {
      Bubble.hide();
    },
    editPost() {
      this.$store.commit("profile/media/startEditMedia", this.postId, {
        root: true
      });

      this.$store.dispatch("modal/show", {
        name: "editMedia",
        data: {
          postId: this.postId
        }
      });
    },
    copyHref() {
      this.$copyText(this.href).then(() => {
        this.$store.dispatch(
          "global/flashToast",
          { text: "Link copied!" },
          {
            root: true
          }
        );
      });
    }
  },
  mounted() {
    this.popupItem = this.$el.querySelector(".more-functions");
  },
  beforeDestroy() {
    Bubble._hide();
  },
  directives: {
    ClickOutside
  }
};
</script>

<style lang="scss" scoped>
.post-header {
  padding-right: 10px;
}
.mediaStatus {
  &.isActive {
    color: #2196f3;
  }
  &.notActive {
    color: #e31b1d;
  }
}
.actionsContainer {
  margin-left: auto;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  & > span {
    margin-left: 10px;
  }
  .icon-link {
    cursor: pointer;
    padding: 5px 7px;
    transition: background-color 0.5s ease;
    border-radius: 1000px;
    &:hover {
      background-color: #e4e4e4;
    }
  }
}
.toggle-element {
  &.label {
    transform: translateY(-50px);
  }
}
.labelWrapper {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  .labelWrapper__label {
    &:first-child {
      margin-right: 5px;
    }
    &:last-child {
      margin-left: 5px;
    }
  }
}
</style>
