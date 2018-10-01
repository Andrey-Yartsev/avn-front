import request from "@/utils/request";

export default {
  fetch() {
    return request("init", {
      method: "GET"
    });
  }
};
