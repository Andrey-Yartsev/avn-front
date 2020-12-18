import Store from "@/store";

const showTimeout = 300;
let showTimeoutId = 0;
let hideTimeoutId = 0;

const _hide = () => {
  if (!Store.state.userBubble.show) {
    return;
  }
  Store.dispatch("userBubble/hide");
};

const _open = ({ a, username }) => {
  // if (!window.userBubble) {
  //   window.userBubble = document.getElementById("user-bubble");
  // }
  window.userBubble = document.getElementById("user-bubble");
  const bubble = window.userBubble;
  const r = a.getBoundingClientRect();
  let up = false;
  if (r.bottom > window.innerHeight - 200) {
    up = true;
    bubble.style.top = r.top - 12 - 200 + "px";
  } else {
    bubble.style.top = r.top + 20 + "px";
  }
  bubble.style.visibility = "hidden";
  bubble.style.left = r.left + "px";
  if (!username) {
    username = a.dataset.login.replace(/@(.*)/, "$1");
  }
  Store.dispatch("userBubble/open", username);
  setTimeout(() => {
    if (up) {
      const h = bubble.getBoundingClientRect().height;
      bubble.style.top = r.top - 12 - h + "px";
      bubble.classList.add("userView_dropdown-down");
      bubble.classList.remove("userView_dropdown-up");
    } else {
      bubble.classList.remove("userView_dropdown-down");
      bubble.classList.add("userView_dropdown-up");
    }
    bubble.style.visibility = "visible";
  }, 10);
};

export default {
  open(data) {
    clearTimeout(hideTimeoutId);
    clearTimeout(showTimeoutId);
    showTimeoutId = setTimeout(() => {
      _open(data);
    }, showTimeout);
  },
  show() {
    clearTimeout(hideTimeoutId);
  },
  hide() {
    hideTimeoutId = setTimeout(_hide, showTimeout);
  },
  _hide() {
    clearTimeout(showTimeoutId);
    Store.dispatch("userBubble/hide");
  }
};

window.onscroll = () => {
  _hide();
};
