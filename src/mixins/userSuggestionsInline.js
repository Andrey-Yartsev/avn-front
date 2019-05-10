import Bubble from "@/helpers/userBubble";

export default {
  mounted() {
    const bubble = document.getElementById("user-bubble");
    if (this.$refs.text) {
      const aTags = this.$refs.text.getElementsByTagName("a");
      if (aTags && aTags.length) {
        for (let a of aTags) {
          a.addEventListener("mouseover", () => {
            Bubble.open(a, bubble);
          });
          a.addEventListener("mouseout", Bubble.hide);
        }
      }
    }
  }
};
