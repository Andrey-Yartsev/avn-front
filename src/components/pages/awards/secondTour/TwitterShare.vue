<template>
  <span class="twitter" ref="cont"></span>
</template>

<script>
export default {
  name: "TwitterShare",
  props: {
    nominee: Object,
    textString: String
  },
  computed: {
    text() {
      return `I watched, I came, I voted for ${this.nominee.twitter} for the ${
        this.$props.textString
      }`;
    },
    twitterName() {
      return this.nominee.twitter.replace(/@(.*)/, "$1");
    }
  },
  mounted() {
    if (window.twttr && !this.nominee.dummy && this.nominee.twitter) {
      window.twttr.widgets.createShareButton(" ", this.$refs.cont, {
        text: this.text
      });
    }
  }
};
</script>
