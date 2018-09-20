import request from "@/utils/request";

export default {
  login(creds) {
    return request("users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(creds)
    });
  }
};
