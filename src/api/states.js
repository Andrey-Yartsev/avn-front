import request from "@/utils/request";

export default {
  fetch(country) {
    return request(`countries/${country}/states`, {
      method: "GET"
    });
  }
};
