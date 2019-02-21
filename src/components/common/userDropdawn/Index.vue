<template>
  <div class="more-functions" :class="{ open: opened }" v-click-outside="hide">
    <div class="more-functions__overlay" @click="hide"></div>
    <div
      class="more-functions__btn more-functions__btn_with-text"
      @click="toggle"
    >
      <div class="more-functions__btn-text">More</div>
    </div>
    <div class="more-functions__dropdown">
      <div class="more-functions__dropdown-inside">
        <ul>
          <li v-if="!isOwner(profile.id)">
            <a href="#" @click.prevent="report">Report</a>
          </li>
          <template v-if="!isOwner(profile.id)">
            <li v-if="profile.isBlocked">
              <a href="#" @click.prevent="unblock">Unblock</a>
            </li>
            <li v-else>
              <a href="#" @click.prevent="block">Block</a>
            </li>
          </template>
          <template v-if="canMute">
            <li v-if="isMuted">
              <a href="#" @click.prevent="unmute">Unmute</a>
            </li>
            <li v-else>
              <a href="#" @click.prevent="mute">Mute</a>
            </li>
          </template>
          <li v-if="copied">
            <button class="btn-copy-link copied" type="button">Copied!</button>
          </li>
          <li v-else>
            <button class="btn-copy-link" type="button" @click="copyHref">
              Copy link
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import ClickOutside from "vue-click-outside";
import User from "@/mixins/user";
import Mute from "@/mixins/mute";

export default {
  name: "SearchUserDropdown",

  mixins: [User, Mute],

  directives: {
    ClickOutside
  },

  props: {
    profile: {
      type: Object,
      required: true
    },
    actionPrefix: {
      type: String,
      default: "profile/home"
    }
  },

  data() {
    return {
      opened: false,
      copied: false
    };
  },

  computed: {
    href() {
      const { protocol, hostname } = window.location;
      return `${protocol}//${hostname}/${this.profile.username}`;
    },
    isMuted() {
      return this._isMuted(this.profile);
    },
    canMute() {
      if (this.isOwner(this.profile.id)) {
        return false;
      }
      return this._canMute(this.profile);
    }
  },

  methods: {
    report() {
      this.$store.dispatch("modal/show", {
        name: "userReport",
        data: this.profile.id
      });
    },
    block() {
      this.$store.dispatch(this.actionPrefix + "/block", this.profile.id);
    },
    unblock() {
      this.$store.dispatch(this.actionPrefix + "/unblock", this.profile.id);
    },
    mute() {
      this.$store.dispatch(this.actionPrefix + "/mute", this.profile);
    },
    unmute() {
      this.$store.dispatch(this.actionPrefix + "/unmute", this.profile);
    },
    toggle() {
      if (this.opened) {
        this.hide();
      } else {
        this.open();
      }
    },
    open() {
      this.opened = true;
      this.$emit("openDropdawn");
    },
    hide() {
      this.opened = false;
      this.$emit("hideDropdawn");
    },
    copyHref() {
      this.$copyText(this.href).then(() => {
        this.copied = true;
        setTimeout(() => (this.copied = false), 1000);
      });
    }
  }
};
</script>
