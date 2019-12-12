<template>
  <span class="twitter" ref="cont"></span>
</template>

<script>
export default {
  name: "TwitterGayShare",
  props: {
    nominee: Object
  },
  computed: {
    text() {
      return `I watched, I came, I voted for ${
        this.nominee.twitter
      } for the #GayVNAwards https://stars.gayvn.com/gayvn_awards/voting on #GayVNStars`;
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
