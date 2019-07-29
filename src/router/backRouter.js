import Store from "@/store";
import Router from "@/router";

export default {
  back() {
    Store.commit("backRouter/pop");
    const stack = Store.state.backRouter.stack;
    if (!stack.length) {
      Router.push("/");
      return;
    }
    const prev = stack[stack.length - 1];
    Router.push(prev.path);
  }
};
