import queryString from "query-string";
import Store from "@/store";
import request from "./request";

export default async (apiPath, options) => {
  if (!Store.state.auth.user || !Store.state.auth.user.accessToken) {
    throw new Error("Method is allowed only for authorized users");
  }

  const query = {
    ...options.query,
    "access-token": Store.state.auth.user.accessToken
  };

  const params = queryString.stringify(query);
  delete options.query;

  return request(`${apiPath}?${params}`, options);
};
