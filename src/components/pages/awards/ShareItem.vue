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
    v: Object
  },
  data() {
    return {
      html: `I just pre-nominated ${this.v.name} for <b>${
        this.v.category.title
      }</b> @AVNAwards on AVNStars.com`,
      text: `I just pre-nominated ${this.v.name} for ${
        this.v.category.title
      } @AVNAwards on AVNStars.com`
    };
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
    window.twttr.widgets.createShareButton("", this.$refs.cont, {
      text: this.text
    });
    // console.log(this.$refs.tweetBtn, window.twttr);
    // new window.twttr.createMentionButton("asd", this.$refs.cont.$el);
    // tweetButton.render();
  }
};
</script>
