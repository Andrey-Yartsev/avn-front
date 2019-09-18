import Store from "@/store";

export default path => {
  let gayHost;
  const l = window.location;
  if (process.env.NODE_ENV === "development") {
    gayHost = "gayvn.localhost:" + l.port;
  } else {
    gayHost = process.env.VUE_APP_GAY_HOST;
  }
  let token = "";
  if (Store.state.auth.token) {
    token = "?auth_token=" + Store.state.auth.token;
  }
  return (
    l.protocol +
    "//" +
    gayHost +
    (path !== undefined ? path : l.pathname) +
    token
  );
};
