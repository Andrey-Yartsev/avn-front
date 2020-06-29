<template>
  <div
    class="more-functions"
    :class="{ open: opened }"
    @click="opened = !opened"
    v-click-outside="
      () => {
        opened = false;
      }
    "
  >
    <div
      class="more-functions__overlay"
      @click="
        () => {
          opened = false;
        }
      "
    ></div>
    <div class="more-functions__btn"></div>
    <div class="more-functions__dropdown">
      <div class="more-functions__dropdown-inside">
        <ul class="more-functions__list">
          <li class="more-functions__item">
            <a
              :href="shareLink"
              class="menu-cancel more-functions__link"
              @click.prevent="copyShareLink"
            >
              <span class="more-functions__option">Copy share link</span>
            </a>
          </li>
          <li class="more-functions__item">
            <a class="menu-cancel more-functions__link">
              <span class="more-functions__option">Cancel</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import ClickOutside from "vue-click-outside";

export default {
  name: "NomineeMenu",
  props: {
    nominee: Object,
    contestId: {
      type: Number,
      required: true
    }
  },
  directives: {
    ClickOutside
  },
  data() {
    return {
      opened: false
    };
  },
  computed: {
    shareLink() {
      return `${window.location.origin}/${this.nominee.username}/c/${
        this.contestId
      }/${this.nominee.id}`;
    }
  },
  methods: {
    copyShareLink() {
      this.$copyText(this.shareLink).then(() => {
        this.$store.dispatch("global/flashToast", {
          text: "Link copied!"
        });
      });
    }
  }
};
</script>
