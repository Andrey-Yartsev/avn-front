import Bubble from "@/helpers/userBubble";

export default {
  mounted() {
    if (this.$mq === "mobile") {
      return;
    }
    if (this.$refs.text) {
      const aTags = this.$refs.text.getElementsByTagName("a");
      if (aTags && aTags.length) {
        for (let a of aTags) {
          if (!a.innerText.match(/^@(.*)/)) {
            continue;
          }
          a.addEventListener("mouseover", () => {
            Bubble.open({ a });
          });
          a.addEventListener("mouseout", Bubble.hide);
        }
      }
    }
  }
};
