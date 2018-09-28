import tokenRequest from "@/utils/tokenRequest";

export default {
  fetchInitCodes() {
    return tokenRequest("users/otp/code", {
      method: "GET"
    });
  },
  setCode(code) {
    return tokenRequest("users/otp", {
      method: "PUT",
      data: { code }
    });
  },
  deleteCode(code) {
    return tokenRequest("users/otp", {
      method: "DELETE",
      data: { code }
    });
  }
};
