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
        <ul class="more-functions__list">
          <li v-if="!isOwner(profile.id) && user" class="more-functions__item">
            <a href="#" @click.prevent="report" class="more-functions__link">
              <span class="more-functions__option">
                Report
              </span>
            </a>
          </li>
          <template v-if="!isOwner(profile.id) && user">
            <li v-if="profile.isBlocked" class="more-functions__item">
              <a href="#" @click.prevent="unblock" class="more-functions__link">
                <span class="more-functions__option">
                  Unblock
                </span>
              </a>
            </li>
            <li class="more-functions__item" v-else>
              <a href="#" @click.prevent="block" class="more-functions__link">
                <span class="more-functions__option">
                  Block
                </span>
              </a>
            </li>
            <li v-if="profile.isPaidBlocked" class="more-functions__item">
              <a
                href="#"
                @click.prevent="paidUnblock"
                class="more-functions__link"
              >
                <span class="more-functions__option">
                  Paid unblock
                </span>
              </a>
            </li>
            <li class="more-functions__item" v-else>
              <a
                href="#"
                @click.prevent="paidBlock"
                class="more-functions__link"
              >
                <span class="more-functions__option">
                  Paid block
                </span>
              </a>
            </li>
          </template>
          <template v-if="canMute && user">
            <li class="more-functions__item" v-if="isMuted">
              <a href="#" @click.prevent="unmute" class="more-functions__link">
                <span class="more-functions__option">
                  Unmute
                </span>
              </a>
            </li>
            <li class="more-functions__item" v-else>
              <a href="#" @click.prevent="mute" class="more-functions__link">
                <span class="more-functions__option">
                  Mute
                </span>
              </a>
            </li>
          </template>
          <li class="more-functions__item" v-if="copied">
            <button
              class="btn-copy-link copied more-functions__link"
              type="button"
            >
              <span class="more-functions__option">
                Copied!
              </span>
            </button>
          </li>
          <li class="more-functions__item" v-else>
            <button
              class="btn-copy-link more-functions__link"
              type="button"
              @click="copyHref"
            >
              <span class="more-functions__option">
                Copy link
              </span>
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
      return this.profile.isMuted;
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
    paidBlock() {
      this.$store.dispatch("modal/show", {
        name: "paidBlock",
        data: {
          userId: this.profile.id,
          actionPrefix: this.actionPrefix
        }
      });
    },
    paidUnblock() {
      this.$store.dispatch(this.actionPrefix + "/paidUnblock", this.profile.id);
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
      this.$emit("openDropdown");
    },
    hide() {
      this.opened = false;
      this.$emit("hideDropdown");
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
