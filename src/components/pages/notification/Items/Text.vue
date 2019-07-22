<template>
  <span v-html="text" ref="text" />
</template>

<script>
import Goto from "@/mixins/modalRouter/goto.js";

export default {
  mixins: [Goto],
  props: {
    text: String
  },
  methods: {
    initPostText() {
      const els = this.$refs.text.getElementsByTagName("a");
      for (let el of els) {
        let m = el.href.match(/post\/(\d+)/);
        if (m) {
          let postId = m[1];
          el.addEventListener("click", e => {
            e.preventDefault();
            this.openModal(postId);
          });
        }
      }
    },
    openModal(id) {
      this.goToModalRoute(`post/${id}/home`);
    }
  },
  mounted() {
    this.initPostText(this.$refs.text);
  }
};
</script>
