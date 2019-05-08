import Store from "@/store";

let bubbleTimeoutId = 0;

const _hide = () => {
  Store.dispatch("userBubble/hide");
};

export default {
  open(a, bubble) {
    clearTimeout(bubbleTimeoutId);
    const r = a.getBoundingClientRect();
    bubble.style.top = r.top + 20 + "px";
    bubble.style.left = r.left + "px";
    Store.dispatch("userBubble/open", a.innerText.replace(/@(.*)/, "$1"));
  },
  show() {
    clearTimeout(bubbleTimeoutId);
  },
  hide() {
    bubbleTimeoutId = setTimeout(_hide, 100);
  },
  _hide() {
    Store.dispatch("userBubble/hide");
  }
};
