import queryString from "query-string";
import Store from "@/store";
import request from "./request";

export default async (apiPath, options) => {
  const query = {
    ...options.query,
    "access-token": Store.state.auth.token
  };

  if (Store.state.auth.token) {
    query["access-token"] = Store.state.auth.token;
  }

  const params = queryString.stringify(query);
  delete options.query;

  return request(`${apiPath}?${params}`, options);
};
