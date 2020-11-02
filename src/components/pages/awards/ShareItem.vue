<template>
  <label class="form-group form-group_row-md">
    <span class="label label_row">{{ v.title }}</span>
    <span class="form-group form-group_clear-gaps">
      <span class="form-field">
        <div v-html="html" class="tweet-text"></div>
        <div class="btns">
          <a
            target="_blank"
            :href="getHrefString()"
            class="btn-block btn-tweet btn-twitter"
            data-show-count="false"
          >
            <span class="icn-item icn-twitter icn-size_sm"></span>
            <span class="btn-twitter__label">Tweet</span>
          </a>
          <!-- <div ref="cont" class="btn-tweet"></div> -->
        </div>
      </span>
    </span>
  </label>
</template>

<script>
export default {
  name: "NominationShareItem",
  props: {
    v: Object,
    isGay: Boolean
  },
  computed: {
    html() {
      return (
        `I just pre-nominated ${this.v.name} for <b>${
          this.v.category.title
        }</b> ` + this.ending
      );
    },
    text() {
      return (
        `I just pre-nominated ${this.v.name} for ${this.v.category &&
          this.v.category.title} ` + this.ending
      );
    },
    ending() {
      return this.isGay
        ? "#GayVNAwards @GayVN on GayVNStars.com"
        : "@AVNAwards on AVNStars.com #AVNAwards";
    }
  },
  methods: {
    copyToClipboard() {
      this.$copyText(this.text).then(() => {
        this.$store.dispatch("global/flashToast", {
          text: "Tweet text copied!"
        });
      });
    },
    getHrefString() {
      let text = encodeURI(this.text) || "";
      text = text.replace(/#/g, "%23");
      return `https://twitter.com/intent/tweet?text=${text}`;
    }
  },
  mounted() {
    // if (window.twttr) {
    //   // fix error from sentry. but can't reproduce
    //   window.twttr.widgets.createShareButton(" ", this.$refs.cont, {
    //     text: this.text
    //   });
    // }
  }
};
</script>
