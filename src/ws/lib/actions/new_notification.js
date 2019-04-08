import Store from "@/store";

export default data => {
  if (!data.is_read) {
    Store.dispatch("auth/extendUser", { hasNotifications: true });
  }
};
