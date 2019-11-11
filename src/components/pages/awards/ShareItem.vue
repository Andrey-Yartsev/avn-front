<template>
  <label class="form-group form-group_row-md">
    <span class="label label_row">{{ v.title }}</span>
    <span class="form-group form-group_clear-gaps">
      <span class="form-field">
        <div v-html="html" class="tweet-text"></div>
        <div class="btns">
          <div ref="cont" class="btn-tweet"></div>
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
    }
  },
  mounted() {
    if (window.twttr) {
      // fix error from sentry. but can't reproduce
      window.twttr.widgets.createShareButton(" ", this.$refs.cont, {
        text: this.text
      });
    }
  }
};
</script>
