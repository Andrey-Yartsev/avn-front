import Store from "@/store";

export default toasts => {
  toasts.forEach(toast => {
    Store.dispatch("global/flashToast", toast.text + "***");
  });
};
