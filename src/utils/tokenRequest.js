import Store from "@/store";
import request from "./request";

export default async (apiPath, options) => {
  if (!Store.state.auth.user || !Store.state.auth.user.accessToken) {
    throw new Error("Method is allowed only for authorized users");
  }
  return request(
    apiPath + "?access-token=" + Store.state.auth.user.accessToken,
    options
  );
};
