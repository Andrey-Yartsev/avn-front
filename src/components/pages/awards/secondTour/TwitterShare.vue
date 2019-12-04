<template>
  <span class="twitter" ref="cont"></span>
</template>

<script>
export default {
  name: "TwitterShare",
  props: {
    nominee: Object
  },
  computed: {
    text() {
      return `I watched, I came, I voted for {twitter} for the #AVN @AVNAwards {fan voting link} on #AVNStars`;
    }
  },
  mounted() {
    if (window.twttr && !this.nominee.dummy) {
      window.twttr.widgets.createShareButton(" ", this.$refs.cont, {
        text: this.text
      });
    }
  }
};
</script>
