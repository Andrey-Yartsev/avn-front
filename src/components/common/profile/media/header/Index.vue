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
    <span
      class="verified-user icn-item"
      :class="{
        fullyMonetized: postUser.canEarn && postUser.canPayoutsRequest
      }"
      v-if="
        postUser.isVerified || (postUser.canEarn && postUser.canPayoutsRequest)
      "
    ></span>
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
    <template>
      <span class="actionsContainer">
        <template v-if="isAuthor">
          <span
            class="labelWrapper"
            v-if="
              post.media.videoPreview &&
                post.media.videoPreview.source &&
                view === 'large'
            "
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
          <span
            @click="pinToggle"
            class="icn-pin icn-item icn-size_md"
            :class="{ pinned: post.pinned }"
            v-tooltip="post.pinned ? `Unpin video` : `Pin video`"
          ></span>
          <span v-if="post.active" class="mediaStatus isActive">
            <span class="icn-item verified-user fullyMonetized" />
            Active
          </span>
          <span v-else class="mediaStatus notActive">
            <span class="icn-item icn-block" />
            Not active
          </span>
        </template>
        <div
          class="more-functions options"
          :class="{ open: opened }"
          v-click-outside="hide"
        >
          <div class="more-functions__overlay" @click="hide"></div>
          <div
            class="more-functions__btn"
            :class="{ 'more-functions__btn_with-text': $mq === 'desktop' }"
            @click="toggle"
          >
            <div v-if="$mq === 'desktop'" class="more-functions__btn-text">
              More
            </div>
          </div>
          <div class="more-functions__dropdown">
            <Dropdown
              :post="post"
              :from="from"
              :hide="hide"
              :isAuthor="isAuthor"
            />
          </div>
        </div>
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
    toggle() {
      this.opened ? this.hide() : this.open();
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
    pinToggle() {
      this.$store.dispatch("profile/media/updateMedia", this.getMediaData(), {
        root: true
      });
    },
    getMediaData() {
      const data = {
        media: {
          ...this.post,
          pinned: !this.post.pinned
        },
        productId: this.post.productId
      };
      if (data.media.freeAccessUsers) {
        delete data.media.freeAccessUsers;
      }
      return data;
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
.more-functions {
  &.options {
    position: relative;
    margin-left: 10px;
    top: 0;
  }
}
.icn-pin {
  cursor: pointer;
  opacity: 0.5;
  &:hover {
    opacity: 1;
  }
  &.pinned {
    opacity: 1;
  }
}
</style>
