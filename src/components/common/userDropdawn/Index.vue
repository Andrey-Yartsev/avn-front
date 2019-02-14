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
          <li><a href="#" @click.prevent="report">Report</a></li>
          <li v-if="profile.isBlocked">
            <a href="#" @click.prevent="unblock">Unblock</a>
          </li>
          <li v-else><a href="#" @click.prevent="block">Block</a></li>

          <template v-if="hasMute">
            <li v-if="isMuted">
              <a href="#" @click.prevent="unmute">Unmute</a>
            </li>
            <li v-else><a href="#" @click.prevent="mute">Mute</a></li>
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

export default {
  name: "SearchUserDropdown",

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
    hasMute() {
      return this.actionPrefix === "followers";
    },
    isMuted() {
      return this.profile.followedOn.isMuted;
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
