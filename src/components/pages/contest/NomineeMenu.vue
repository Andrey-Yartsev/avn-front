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
    <div class="more-functions__overlay"></div>
    <!-- <div
      class="more-functions__overlay"
      @click="
        () => {
          opened = false;
        }
      "
    ></div> -->
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
          <li v-if="showTwitterShareLink" class="more-functions__item">
            <a
              :id="'nominee' + nominee.id"
              ref="tweetLink"
              target="_blank"
              :href="getHrefString"
              class="menu-cancel more-functions__link"
              data-show-count="false"
            >
              <span class="more-functions__option">Tweet</span>
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
    },
    contestName: String
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
      }/${this.nominee.star_id}`;
    },
    showTwitterShareLink() {
      return this.nominee.twitter_handle;
    },
    getTextString() {
      return `#AVNStars ${window.location.origin}/${this.nominee.username}/c/${
        this.contestId
      }/${this.nominee.star_id}`;
    },
    getHrefString() {
      const fullText = `I voted for @${this.nominee.twitter_handle} for ${
        this.contestName
      } at ${this.getTextString}`;
      let text = encodeURI(fullText) || "";
      text = text.replace(/#/g, "%23");
      return `https://twitter.com/intent/tweet?text=${text}`;
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
